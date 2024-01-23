import React, { useEffect, useState } from 'react';

import "@cloudscape-design/global-styles/index.css"
import Header from "@cloudscape-design/components/header";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import Button from "@cloudscape-design/components/button";
import Multiselect, { MultiselectProps } from "@cloudscape-design/components/multiselect";
import Tabs from "@cloudscape-design/components/tabs";

import { TabDataViewer } from './TabDataViewer';
import { DataProvider } from './DataProvider';
import { ChartViewer } from './ChartViewer';

import { TelemetryDataPoint } from './types';

const CraftSelector = ({ setCraft }: { setCraft: React.Dispatch<React.SetStateAction<string[]>> }) => {
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

  return (
    <SpaceBetween size="s">
      <span>Enter Spacecraft Name ({options.length} matches)</span>
      <Input
        value={value}
        onChange={(event) => setValue(event.detail.value)}
      />
      <Multiselect
        selectedOptions={selectedOptions}
        onChange={({ detail }) =>
          setSelectedOptions(detail.selectedOptions.slice())
        }
        options={options}
        placeholder="Choose options"
      />
      <Button variant="primary" onClick={() => setCraft(selectedOptions.map(x => x.value || ""))}>View Data</Button>
    </SpaceBetween>
  )
}

const parseCSV = (csvdata: string) => {
  const lines = csvdata.split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
      const obj: any = {};
      line.split(',').forEach((value, index) => {
          if (headers[index] === 'value'){
            obj[headers[index]] = parseFloat(value);
          } else {
            obj[headers[index]] = value;
          }
      });
      return obj;
  });
  return data;
}

// TODO: if no craft selected, display a message
const DataViewer = ({ craft }: { craft: string[] }) => {
  const [data, setData] = useState<TelemetryDataPoint[]>([]);

  useEffect(() => {
      new DataProvider().getData('data').then(rawdata => {
          setData(parseCSV(rawdata.csv_telemetry));
      });
  }, []);

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
                  content: <ChartViewer data={data}/>
              },
          ]}
      />
  )
}

export default function App() {
  const [craft, setCraft] = useState<string[]>([]);


  return (
      <Container header={
        <Header
          variant="h1"
          description="Container description"
        >
          View Spacecraft Data
        </Header>
      }>
        <CraftSelector setCraft={setCraft} />
        <DataViewer craft={craft} />

      </Container>
  );
}

