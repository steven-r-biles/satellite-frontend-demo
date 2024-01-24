import React, { useEffect, useState } from 'react';

import "@cloudscape-design/global-styles/index.css"
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import Multiselect, { MultiselectProps } from "@cloudscape-design/components/multiselect";
import Tabs from "@cloudscape-design/components/tabs";
import Grid from "@cloudscape-design/components/grid";
import FormField from "@cloudscape-design/components/form-field";
import TextContent from "@cloudscape-design/components/text-content";
import { Button } from '@cloudscape-design/components';

import { TabDataViewer } from './TabDataViewer';
import { DataProvider } from './DataProvider';
import { ChartViewer } from './ChartViewer';

import { TelemetryDataPoint } from './types';

const Timer = ({ dataCount }: { dataCount: number }) => {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    setSeconds(0)
  }, [dataCount])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((t) => t + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [])

  return (<TextContent>
    <h5>Time since data loaded</h5>
    {dataCount ? <p>{seconds} seconds</p> : <p>(No data)</p>}
  </TextContent>)
}


export const CraftSelector = ({ setCraft, dataCount }: { setCraft: React.Dispatch<React.SetStateAction<string[]>>, dataCount: number }) => {
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<MultiselectProps.Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps.Option[]>([]);
  const [spacecraft, setSpacecraft] = useState<string[]>([]);

  useEffect(() => {
    new DataProvider().getData('spacecraft').then(craft => {
      setSpacecraft(craft);
    });
  }, []);

  useEffect(() => {
    const matches = spacecraft.filter((craft) => value && craft.toLowerCase().includes(value.toLowerCase()))
    setOptions(matches.map((match) => ({ label: match, value: match })))
  }, [value])

  useEffect(() => {
    setCraft(selectedOptions.map(x => x.value || ""))
  }, [selectedOptions])

  return (
    <SpaceBetween size="s">
      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }, { colspan: 6 }, { colspan: 6 }]}>
        <FormField
          description="Partial matches will populate in the selector."
          label={`Enter Spacecraft Name (${options.length} matches)`}
        >
          <Input
            value={value}
            id="partial_spacecraft_name"
            onChange={(event) => setValue(event.detail.value)}
          />
        </FormField>
        <Timer dataCount={dataCount} />
        <Multiselect
          selectedOptions={selectedOptions}
          onChange={({ detail }) => {
            setSelectedOptions(detail.selectedOptions.slice())
          }
          }
          options={options}
          placeholder="Choose options"
        />
        <Button onClick={() => setSelectedOptions([])}>Clear Selection</Button>
      </Grid>
    </SpaceBetween>
  )
}

const parseCSV = (csvdata: string, craft: string[]) => {
  const lines = csvdata.split('\n');
  const headers = lines[0].split(',');
  const result = [];
  let id = 0;
  for (const craftName of craft) {
    // Since we only have example data for one craft, we'll multiply the values by a random
    // number for each craft selected
    const multiplier = Math.floor(Math.random() * 10) + 1;

    const data = lines.slice(1).map(line => {
      const obj: any = {};
      line.split(',').forEach((value, index) => {
        if (headers[index] === 'measurement') {
          obj[headers[index]] = craftName + '-' + value;
        } else if (headers[index] === 'value') {
          obj[headers[index]] = parseFloat(value) * multiplier;
        } else {
          obj[headers[index]] = value;
        }
      });
      obj.id = id++;
      return obj;
    });
    result.push(...data);
  }
  return result;
}

const DataViewer = ({ data }: { data: TelemetryDataPoint[] }) => {
  if (!data.length) {
    return <p>Select one or more spacecraft to view data</p>;
  }

  return (
    <Tabs
      tabs={[
        {
          label: "Tabular Data",
          id: "tabular",
          content: <TabDataViewer data={data} />
        },
        {
          label: "Chart",
          id: "chart",
          content: <ChartViewer data={data} />
        },
      ]}
    />
  )
}

export default function App() {
  const [craft, setCraft] = useState<string[]>([]);
  const [data, setData] = useState<TelemetryDataPoint[]>([]);

  useEffect(() => {
    new DataProvider().getData('data').then(rawdata => {
      setData(parseCSV(rawdata.csv_telemetry, craft));
    });
  }, [craft]);

  return (
    <Container header={
      <Header
        variant="h1"
      >
        View Spacecraft Data
      </Header>
    }>
      <CraftSelector setCraft={setCraft} dataCount={data.length} />
      <DataViewer data={data} />
    </Container>
  );
}

