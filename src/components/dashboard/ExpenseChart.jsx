import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';

const ExpenseChart = ({ type, data = [], title, height = 300 }) => {
  // Define colors for different expense types and approval statuses
  const colors = {
    line: {
      da: '#8884d8',  // purple for Daily Allowance
      ta: '#4caf50',  // green for Travel Allowance
      total: '#ffc658' // yellow for Total
    },
    bar: ['#8884d8', '#4caf50', '#ffc658', '#ff8042'],
    pie: {
      Approved: '#8884d8',  // purple
      Pending: '#4caf50',   // green
      Rejected: '#ff8042'   // orange
    }
  };
  
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: `${height}px`, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        color: '#999' 
      }}>
        No data available for chart
      </div>
    );
  }

  // Render different chart types
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                padding={{ left: 20, right: 20 }}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 'dataMax + 300']}
                tickCount={7}
                width={45}
              />
              <Tooltip 
                formatter={(value) => [`${value}`, '']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
                iconType="circle"
              />
              {data[0]?.da !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="da" 
                  name="Daily Allowance" 
                  stroke={colors.line.da} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
              {data[0]?.ta !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="ta" 
                  name="Travel Allowance" 
                  stroke={colors.line.ta}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }} 
                />
              )}
              {data[0]?.total !== undefined && (
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  name="Total" 
                  stroke={colors.line.total}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors.pie[entry.name] || colors.bar[index % colors.bar.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return <div>Invalid chart type</div>;
    }
  };

  return renderChart();
};

export default ExpenseChart;