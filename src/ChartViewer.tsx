import React, { useEffect, useState } from "react";
import LineChart from "@cloudscape-design/components/line-chart";
import Box from "@cloudscape-design/components/box";
import Multiselect, { MultiselectProps } from "@cloudscape-design/components/multiselect";
import SpaceBetween from "@cloudscape-design/components/space-between";

import { TelemetryDataPoint } from './types';



const groupData = (data: TelemetryDataPoint[]) => {
    const grouped: { [key: string]: TelemetryDataPoint[] } = {};
    data.forEach((point) => {
        if (!grouped[point.measurement]) {
            grouped[point.measurement] = [];
        }
        grouped[point.measurement].push(point);
    });
    return grouped;
}

const makeSeries = (grouped: { [name: string]: TelemetryDataPoint[] }, selectedOptions: MultiselectProps.Option[]) => {
    const series = [];
    for (const measurement in grouped) {
        if (!selectedOptions.find((option) => option.value === measurement)) {
            continue;
        }
        series.push({
            title: measurement,
            type: "line" as "line",
            data: grouped[measurement].map((point) => ({ x: new Date(point.time), y: point.value })),
            valueFormatter: (e: number) => e.toFixed(9)
        });
    }
    return series;
}

const findAxisBoundaries = (grouped: { [name: string]: TelemetryDataPoint[] }, selectedOptions: MultiselectProps.Option[]) => {
    let xmin = "2099";
    let xmax = "1900";
    let ymin = Number.MAX_VALUE;
    let ymax = Number.MIN_VALUE;

    for (const measurement in grouped) {
        if (!selectedOptions.find((option) => option.value === measurement)) {
            continue;
        }
        const points = grouped[measurement];
        for (const point of points) {
            xmin = xmin < point.time ? xmin : point.time;
            xmax = xmax > point.time ? xmax : point.time;
            ymin = Math.min(ymin, point.value);
            ymax = Math.max(ymax, point.value);
        }
    }
    return {xmin, xmax, ymin, ymax}
}


export const ChartViewer = ({ data }: { data: TelemetryDataPoint[] }) => {
    const [dataGroups, setDataGroups] = useState<{ [name: string]: TelemetryDataPoint[] }>({});
    const [options, setOptions] = useState<MultiselectProps.Option[]>([]);
    const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Option[]>([]);
    const [xDomain, setXDomain] = useState<[Date, Date]>([new Date(), new Date()]);
    const [yDomain, setYDomain] = useState<[number, number]>([0, 0]);
    useEffect(() => {
        const grouped = groupData(data)
        setDataGroups(grouped);
        setOptions(Object.keys(grouped).map((match) => ({ label: match, value: match })))
    }, [data]);

    useEffect(() => {
        const {xmin, xmax, ymin, ymax} = findAxisBoundaries(dataGroups, selectedOptions);
        setXDomain([new Date(xmin), new Date(xmax)]);
        setYDomain([ymin, ymax]);
    }, [dataGroups, selectedOptions]);


    return (
        <SpaceBetween size="s">
            <Multiselect
                selectedOptions={selectedOptions}
                onChange={({ detail }) =>
                    setSelectedOptions(detail.selectedOptions ? detail.selectedOptions.slice() : [])
                }
                options={options}
                placeholder="Choose options"
            />
            <LineChart
                series={makeSeries(dataGroups, selectedOptions)}
                xDomain={xDomain}
                yDomain={yDomain}
                i18nStrings={{
                    xTickFormatter: e =>
                        e
                            .toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: !1
                            })
                            .split(",")
                            .join("\n"),
                    yTickFormatter: function numberFormatter(e) {
                        return Math.abs(e) <= 1e-6
                            ? (e * 1e9).toFixed(1).replace(/\.0$/, "") +
                            "n"
                            : Math.abs(e) <= 1e-3
                                ? (e * 1e6).toFixed(1).replace(/\.0$/, "") +
                                "µ"
                                : Math.abs(e) <= 1
                                    ? (e * 1e3).toFixed(1).replace(/\.0$/, "") +
                                    "m"
                                    : e.toFixed(2);
                    }
                }}
                height={300}
                hideFilter
                hideLegend
                xScaleType="time"
                yScaleType="linear"
                xTitle="Time (UTC)"
                yTitle="Telemetry Data"
                empty={
                    <Box textAlign="center" color="inherit">
                        <b>No data available</b>
                        <Box variant="p" color="inherit">
                            There is no data available
                        </Box>
                    </Box>
                }
                noMatch={
                    <Box textAlign="center" color="inherit">
                        <b>No matching data</b>
                        <Box variant="p" color="inherit">
                            There is no matching data to display
                        </Box>
                    </Box>
                }
            />
        </SpaceBetween>
    );
}