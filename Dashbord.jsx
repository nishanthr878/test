import React, { useState } from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Typography, Select, MenuItem, InputLabel, FormControl, Table, TableBody, TableCell, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { CalendarToday } from '@mui/icons-material';
import dayjs from 'dayjs';

// Mock data for multiple attendance records
const mockAttendanceRecords = {
  "Team A": {
    total: 100,
    present: 80,
    absent: 15,
    late: 5,
    diversityRatio: {
      male: 60,
      female: 35,
      other: 5
    },
    detailedAttendance: [
      { id: 1, name: "John Doe", status: "Present", arrivalTime: "09:00 AM" },
      { id: 2, name: "Jane Smith", status: "Absent", arrivalTime: "-" },
      { id: 3, name: "Bob Johnson", status: "Late", arrivalTime: "09:15 AM" },
      { id: 4, name: "Alice Brown", status: "Present", arrivalTime: "08:55 AM" },
      { id: 5, name: "Charlie Davis", status: "Present", arrivalTime: "08:50 AM" },
    ]
  },
  // Additional teams omitted for brevity...
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function AttendanceDashboard() {
  const [date, setDate] = useState(new Date());
  const [selectedTeam, setSelectedTeam] = useState("Team A");

  const attendanceData = [
    { name: 'Present', value: mockAttendanceRecords[selectedTeam].present },
    { name: 'Absent', value: mockAttendanceRecords[selectedTeam].absent },
    { name: 'Late', value: mockAttendanceRecords[selectedTeam].late },
  ];

  const diversityData = [
    { name: 'Male', value: mockAttendanceRecords[selectedTeam].diversityRatio.male },
    { name: 'Female', value: mockAttendanceRecords[selectedTeam].diversityRatio.female },
    { name: 'Other', value: mockAttendanceRecords[selectedTeam].diversityRatio.other },
  ];

  const formattedDate = dayjs(date).format('MMM D, YYYY');

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Attendance Dashboard
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Date</InputLabel>
            <Select
              value={formattedDate}
              onChange={(e) => setDate(new Date(e.target.value))}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={formattedDate}>
                <CalendarToday fontSize="small" sx={{ mr: 1 }} />
                {formattedDate}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              {Object.keys(mockAttendanceRecords).map((team) => (
                <MenuItem key={team} value={team}>{team}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Attendance Breakdown" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Diversity Ratio" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diversityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diversityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardHeader title="Detailed Attendance" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold' }}>ID</Typography></TableCell>
                <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold' }}>Name</Typography></TableCell>
                <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold' }}>Status</Typography></TableCell>
                <TableCell><Typography variant="body1" sx={{ fontWeight: 'bold' }}>Arrival Time</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAttendanceRecords[selectedTeam].detailedAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.status}</TableCell>
                  <TableCell>{record.arrivalTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
