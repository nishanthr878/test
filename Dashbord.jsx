import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { CalendarToday } from "@mui/icons-material";
import { format } from "date-fns";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import { Calendar } from "@mui/x-date-pickers";
import { Popover } from "@mui/material";

const mockAttendanceRecords = {
  // Your mock data remains the same
  "Team A": {
    total: 100,
    present: 80,
    absent: 15,
    late: 5,
    diversityRatio: { male: 60, female: 35, other: 5 },
    detailedAttendance: [
      { id: 1, name: "John Doe", status: "Present", arrivalTime: "09:00 AM" },
      { id: 2, name: "Jane Smith", status: "Absent", arrivalTime: "-" },
      { id: 3, name: "Bob Johnson", status: "Late", arrivalTime: "09:15 AM" },
      {
        id: 4,
        name: "Alice Brown",
        status: "Present",
        arrivalTime: "08:55 AM",
      },
      {
        id: 5,
        name: "Charlie Davis",
        status: "Present",
        arrivalTime: "08:50 AM",
      },
    ],
  },
  // Add Team B and Team C data
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AttendanceDashboard() {
  const [date, setDate] = (useState < Date) | (undefined > new Date());
  const [selectedTeam, setSelectedTeam] = useState("Team A");
  const [anchorEl, setAnchorEl] = useState(null);

  const attendanceData = [
    { name: "Present", value: mockAttendanceRecords[selectedTeam].present },
    { name: "Absent", value: mockAttendanceRecords[selectedTeam].absent },
    { name: "Late", value: mockAttendanceRecords[selectedTeam].late },
  ];

  const diversityData = [
    {
      name: "Male",
      value: mockAttendanceRecords[selectedTeam].diversityRatio.male,
    },
    {
      name: "Female",
      value: mockAttendanceRecords[selectedTeam].diversityRatio.female,
    },
    {
      name: "Other",
      value: mockAttendanceRecords[selectedTeam].diversityRatio.other,
    },
  ];

  const handleDateClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div
      style={{
        padding: "16px",
        maxWidth: "1200px",
        margin: "auto",
        height: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Attendance Dashboard
      </Typography>

      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Calendar date={date} onChange={(newDate) => setDate(newDate)} />
          </Popover>
          <Button
            variant="outlined"
            startIcon={<CalendarToday />}
            onClick={handleDateClick}
            style={{ width: "200px" }}
          >
            {date ? format(date, "PPP") : "Pick a Date"}
          </Button>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              displayEmpty
            >
              {Object.keys(mockAttendanceRecords).map((team) => (
                <MenuItem key={team} value={team}>
                  {team}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container spacing={4} style={{ marginTop: "16px" }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Attendance Breakdown" />
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
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
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={diversityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diversityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card style={{ marginTop: "24px" }}>
        <CardHeader title="Detailed Attendance" />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" style={{ fontWeight: "bold" }}>
                    Arrival Time
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockAttendanceRecords[selectedTeam].detailedAttendance.map(
                (attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>{attendee.name}</TableCell>
                    <TableCell>{attendee.status}</TableCell>
                    <TableCell>{attendee.arrivalTime}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
