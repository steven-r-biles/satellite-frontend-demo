import React, { useEffect, useState } from 'react';


import Table from "@cloudscape-design/components/table";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import TextFilter from "@cloudscape-design/components/text-filter";
import Header from "@cloudscape-design/components/header";
import Pagination from "@cloudscape-design/components/pagination";
import CollectionPreferences, {CollectionPreferencesProps} from "@cloudscape-design/components/collection-preferences";
import { useCollection } from '@cloudscape-design/collection-hooks';

import { TelemetryDataPoint } from './types';

const columnDefinitions = [
    {
        id: "measurement",
        header: "Measurement",
        cell: (item: TelemetryDataPoint) => item.measurement,
        sortingField: "name",
        isRowHeader: true
    },
    {
        id: "time",
        header: "Time",
        cell: (item: TelemetryDataPoint) => item.time,
    },
    {
        id: "value",
        header: "Value",
        cell: (item: TelemetryDataPoint) => item.value
    },
    {
        id: "apid",
        header: "apid",
        cell: (item: TelemetryDataPoint) => item.apid
    }
]

const paginationLabels = {
    nextPageLabel: 'Next page',
    pageLabel: (pageNumber: number) => `Go to page ${pageNumber}`,
    previousPageLabel: 'Previous page',
};
const pageSizePreference = {
    title: 'Select page size',
    options: [
        { value: 10, label: '10 resources' },
        { value: 20, label: '20 resources' },
    ],
};
const visibleContentPreference = {
    title: 'Select visible content',
    options: [
      {
        label: 'Main properties',
        options: columnDefinitions.map(({ id, header }) => ({ id, label: header, editable: id !== 'id' })),
      },
    ],
  };
const collectionPreferencesProps = {
    pageSizePreference,
    visibleContentPreference,
    cancelLabel: 'Cancel',
    confirmLabel: 'Confirm',
    title: 'Preferences',
};

function EmptyState({ title, }: { title: string }) {
    return (
        <Box textAlign="center" color="inherit">
            <Box variant="strong" textAlign="center" color="inherit">
                {title}
            </Box>

        </Box>
    );
}

export const TabDataViewer = ({ data }: { data: TelemetryDataPoint[] }) => {
    const [preferences, setPreferences] = useState<CollectionPreferencesProps.Preferences>({ pageSize: 20 });
    const { items, actions, filteredItemsCount, collectionProps, filterProps, paginationProps } = useCollection(
        data,
        {
            filtering: {
                empty: <EmptyState title="No instances" />,
                noMatch: (
                    <EmptyState
                        title="No matches"
                    />
                ),
            },
            pagination: { pageSize: preferences.pageSize },
            sorting: {},
            selection: {},
        }
    );
    const { selectedItems } = collectionProps;
    return (
        <Table
            {...collectionProps}
            columnDefinitions={columnDefinitions}
            columnDisplay={preferences.contentDisplay}
            items={items}
            loadingText="Loading resources"
            trackBy="id"
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
            header={
                <Header
                counter={selectedItems?.length ? `(${selectedItems.length}/${data.length})` : `(${data.length})`}
                >
                    Telemetry Data
                </Header>
            }
            pagination={<Pagination {...paginationProps} />}
            preferences={
                <CollectionPreferences
                    {...collectionPreferencesProps}
                    title="Preferences"
                    confirmLabel="Confirm"
                    cancelLabel="Cancel"
                    preferences={preferences}
                    pageSizePreference={{
                        title: "Page size",
                        options: [
                            { value: 10, label: "10 resources" },
                            { value: 20, label: "20 resources" }
                        ]
                    }}
                    contentDisplayPreference={{
                        options: [
                            {
                                id: "measurement",
                                label: "Measurement",
                                alwaysVisible: true
                            },
                            { id: "time", label: "Time" },
                            { id: "value", label: "Value" },
                            { id: "apid", label: "apid" }
                        ]
                    }}
                    onConfirm={({ detail }) => setPreferences(detail)}
                />
            }
        />
    );
}

