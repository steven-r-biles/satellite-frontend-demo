import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { ChartViewer } from './ChartViewer';
import { TabDataViewer } from './TabDataViewer';

test('renders header', () => {
  render(<App />);
  const headerElement = screen.getByText(/View Spacecraft Data/i);
  expect(headerElement).toBeInTheDocument();
});

it('displays no data message if data is empty array', () => {
  render(
    <ChartViewer data={[]} />,
  );

  const chartElement = screen.getByText(/There is no data available/i);
  expect(chartElement).toBeInTheDocument();
});

const data = [
  {
    id: 1,
    measurement: 'test_measurement',
    time: '2024-01-24',
    value: 999,
    apid: 1
  }
]

it('displays data in table', () => {
  render(
    <TabDataViewer data={data} />,
  );

  const chartElement = screen.getByText(/test_measurement/i);
  expect(chartElement).toBeInTheDocument();
});

