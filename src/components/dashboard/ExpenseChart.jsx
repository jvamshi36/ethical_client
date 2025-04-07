import React from 'react';
import { Paper, Typography } from '@mui/material';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import '../../styles/components/dashboard.css';

const ExpenseChart = ({ 
  type = 'line', 
  data = [], 
  title,
  height = 300,
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042']
}) => {
  
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis dataKey="name" className="chart-axis" />
              <YAxis className="chart-axis" />
              <Tooltip className="chart-tooltip" />
              <Legend className="chart-legend" />
              {data[0] && Object.keys(data[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line 
                    key={key}
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                    className="chart-line"
                  />
                ))
              }
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="chart-grid" />
              <XAxis dataKey="name" className="chart-axis" />
              <YAxis className="chart-axis" />
              <Tooltip className="chart-tooltip" />
              <Legend className="chart-legend" />
              {data[0] && Object.keys(data[0])
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar 
                    key={key}
                    dataKey={key} 
                    fill={colors[index % colors.length]}
                    className="chart-bar"
                  />
                ))
              }
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
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                className="chart-pie"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    className="chart-pie-cell"
                  />
                ))}
              </Pie>
              <Tooltip className="chart-tooltip" />
              <Legend className="chart-legend" />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <Paper className="chart-container">
      {title && (
        <Typography variant="h6" className="chart-title">
          {title}
        </Typography>
      )}
      
      {renderChart()}
    </Paper>
  );
};

export default ExpenseChart;