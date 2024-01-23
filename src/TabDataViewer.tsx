import React, { useEffect, useState } from 'react';


import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences from "@cloudscape-design/components/collection-preferences";

import { TelemetryDataPoint } from './types';



export const TabDataViewer = ({ data }: { data: TelemetryDataPoint[] }) => {
    return (
        <Table

            columnDefinitions={[
                {
                    id: "measurement",
                    header: "Measurement",
                    cell: item => item.measurement,
                    sortingField: "name",
                    isRowHeader: true
                },
                {
                    id: "time",
                    header: "Time",
                    cell: item => item.time,
                },
                {
                    id: "value",
                    header: "Value",
                    cell: item => item.value
                },
                {
                    id: "apid",
                    header: "apid",
                    cell: item => item.apid
                }
            ]}
            columnDisplay={[
                { id: "measurement", visible: true },
                { id: "time", visible: true },
                { id: "value", visible: true },
                { id: "apid", visible: true }
            ]}
            items={data}
            loadingText="Loading resources"
            selectionType="multi"
            trackBy="name"
            empty={
                <Box
                    margin={{ vertical: "xs" }}
                    textAlign="center"
                    color="inherit"
                >
                    <SpaceBetween size="m">
                        <b>No data</b>
                    </SpaceBetween>
                </Box>
            }
            filter={
                <TextFilter
                    filteringPlaceholder="Find resources"
                    filteringText=""
                />
            }
            header={
                <Header
                    counter={
                        data.length
                            ? "(" + data.length + "/10)"
                            : "(10)"
                    }
                >
                    Telemetry Data
                </Header>
            }
            pagination={
                <Pagination currentPageIndex={1} pagesCount={2} />
            }
            preferences={
                <CollectionPreferences
                    title="Preferences"
                    confirmLabel="Confirm"
                    cancelLabel="Cancel"
                    preferences={{
                        pageSize: 10,
                        contentDisplay: [
                            { id: "variable", visible: true },
                            { id: "value", visible: true },
                            { id: "type", visible: true },
                            { id: "description", visible: true }
                        ]
                    }}
                    pageSizePreference={{
                        title: "Page size",
                        options: [
                            { value: 10, label: "10 resources" },
                            { value: 20, label: "20 resources" }
                        ]
                    }}
                    wrapLinesPreference={{}}
                    stripedRowsPreference={{}}
                    contentDensityPreference={{}}
                    contentDisplayPreference={{
                        options: [
                            {
                                id: "variable",
                                label: "Variable name",
                                alwaysVisible: true
                            },
                            { id: "value", label: "Text value" },
                            { id: "type", label: "Type" },
                            { id: "description", label: "Description" }
                        ]
                    }}
                    stickyColumnsPreference={{
                        firstColumns: {
                            title: "Stick first column(s)",
                            description:
                                "Keep the first column(s) visible while horizontally scrolling the table content.",
                            options: [
                                { label: "None", value: 0 },
                                { label: "First column", value: 1 },
                                { label: "First two columns", value: 2 }
                            ]
                        },
                        lastColumns: {
                            title: "Stick last column",
                            description:
                                "Keep the last column visible while horizontally scrolling the table content.",
                            options: [
                                { label: "None", value: 0 },
                                { label: "Last column", value: 1 }
                            ]
                        }
                    }}
                />
            }
        />
    );
}

