import React, { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { CalendarToday as CalendarIcon } from '@mui/icons-material'
import { format } from 'date-fns'
import {
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'

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
  "Team B": {
    total: 80,
    present: 70,
    absent: 8,
    late: 2,
    diversityRatio: {
      male: 45,
      female: 50,
      other: 5
    },
    detailedAttendance: [
      { id: 1, name: "Eva White", status: "Present", arrivalTime: "08:45 AM" },
      { id: 2, name: "Frank Green", status: "Present", arrivalTime: "08:55 AM" },
      { id: 3, name: "Grace Lee", status: "Late", arrivalTime: "09:10 AM" },
      { id: 4, name: "Henry Taylor", status: "Absent", arrivalTime: "-" },
      { id: 5, name: "Ivy Chen", status: "Present", arrivalTime: "09:00 AM" },
    ]
  },
  "Team C": {
    total: 60,
    present: 55,
    absent: 3,
    late: 2,
    diversityRatio: {
      male: 40,
      female: 55,
      other: 5
    },
    detailedAttendance: [
      { id: 1, name: "Jack Wilson", status: "Present", arrivalTime: "08:50 AM" },
      { id: 2, name: "Kate Brown", status: "Present", arrivalTime: "08:55 AM" },
      { id: 3, name: "Liam Davis", status: "Late", arrivalTime: "09:05 AM" },
      { id: 4, name: "Mia Johnson", status: "Present", arrivalTime: "09:00 AM" },
      { id: 5, name: "Noah Smith", status: "Absent", arrivalTime: "-" },
    ]
  }
}

const COLORS = ['#4CAF50', '#FF5722', '#FFC107', '#2196F3']

export default function Component() {
  const [date, setDate] = useState(new Date())
  const [selectedTeam, setSelectedTeam] = useState("Team A")
  const [anchorEl, setAnchorEl] = useState(null)

  const attendanceData = [
    { name: 'Present', value: mockAttendanceRecords[selectedTeam].present },
    { name: 'Absent', value: mockAttendanceRecords[selectedTeam].absent },
    { name: 'Late', value: mockAttendanceRecords[selectedTeam].late },
  ]

  const diversityData = [
    { name: 'Male', value: mockAttendanceRecords[selectedTeam].diversityRatio.male },
    { name: 'Female', value: mockAttendanceRecords[selectedTeam].diversityRatio.female },
    { name: 'Other', value: mockAttendanceRecords[selectedTeam].diversityRatio.other },
  ]

  const handleDateClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDateClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <Box sx={{ p: 4, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>Attendance Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDateClick}
            startIcon={<CalendarIcon />}
            fullWidth
            sx={{ textTransform: 'none', boxShadow: 3 }}
          >
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleDateClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => <TextField {...params} sx={{ mt: 2, mx: 2 }} />}
              />
            </LocalizationProvider>
          </Popover>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiSelect-select': {
                padding: '10px',
              },
              boxShadow: 3,
              borderRadius: 1,
            }}
          >
            {Object.keys(mockAttendanceRecords).map((team) => (
              <MenuItem key={team} value={team}>{team}</MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Attendance Breakdown</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Diversity Ratio</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={diversityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diversityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ boxShadow: 3, borderRadius: 2, mt: 4 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>Detailed Attendance</Typography>
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
  )
}
