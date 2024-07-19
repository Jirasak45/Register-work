import React, { useState } from 'react';
import { TextField, Button, MenuItem, Typography, Box, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

// Define the positions for the dropdown menu
const positions = [
  { value: 'Front-end Trainee', label: 'Front-end Trainee' },
  { value: 'HR Trainee', label: 'HR Trainee' },
  { value: 'Application Tester Trainee', label: 'Application Tester Trainee' }
];

// Style the hidden file input
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function RegistrationForm() {
  const [formValues, setFormValues] = useState({
    name: '',
    position: '',
    birthDate: null,
    gpa: '',
    address: '',
    contactNumber: '',
    file: null,
  });
  const [filename, setFilename] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: ''
    });
  };

  // Handle date changes
  const handleDateChange = (date) => {
    setFormValues({
      ...formValues,
      birthDate: date,
    });
    setErrors({
      ...errors,
      birthDate: ''
    });
  };

  // Handle file changes
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFilename(file.name);
      setIsUploaded(true);
      setFormValues({
        ...formValues,
        file: event.target.files[0],
      });
      setErrors({
        ...errors,
        file: ''
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!formValues.name) newErrors.name = 'Name is required';
    if (!formValues.position) newErrors.position = 'Position is required';
    if (!formValues.birthDate) newErrors.birthDate = 'Birth date is required';
    if (!formValues.gpa) newErrors.gpa = 'GPA is required';
    if (!formValues.address) newErrors.address = 'Address is required';
    if (!formValues.contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!formValues.file) newErrors.file = 'File is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    for (const key in formValues) {
      formData.append(key, formValues[key]);
    }

    try {
      const response = await axios.post('http://localhost:5000/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Form Submission Successful');
        setErrors({});
      } else {
        alert('Form submission failed');
      }
    } catch (error) {
      alert('Form submission error: ' + error.message);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'center' }}>
          แบบฟอร์มสำหรับสมัครฝึกงานและแนบไฟล์ประวัติ
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="ชื่อ-นามสกุล"
                variant="outlined"
                value={formValues.name}
                onChange={handleChange}
                required
                error={Boolean(errors.name)}
                helperText={errors.name}
                sx={{ borderColor: errors.name ? 'red' : 'inherit' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                id="position"
                name="position"
                label="เลือกตำแหน่ง"
                variant="outlined"
                value={formValues.position}
                onChange={handleChange}
                required
                error={Boolean(errors.position)}
                helperText={errors.position}
                sx={{ borderColor: errors.position ? 'red' : 'inherit' }}
              >
                {positions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="วันเดือนปีเกิด"
                  format="DD/MM/YYYY"
                  value={formValues.birthDate}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={Boolean(errors.birthDate)}
                      helperText={errors.birthDate}
                      sx={{ borderColor: errors.birthDate ? 'red' : 'inherit' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="gpa"
                name="gpa"
                label="เกรดเฉลี่ย"
                variant="outlined"
                value={formValues.gpa}
                onChange={handleChange}
                required
                error={Boolean(errors.gpa)}
                helperText={errors.gpa}
                sx={{ borderColor: errors.gpa ? 'red' : 'inherit' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="ที่อยู่"
                variant="outlined"
                value={formValues.address}
                onChange={handleChange}
                required
                error={Boolean(errors.address)}
                helperText={errors.address}
                sx={{ borderColor: errors.address ? 'red' : 'inherit' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="contactNumber"
                name="contactNumber"
                label="เบอร์โทรศัพท์ติดต่อ"
                variant="outlined"
                value={formValues.contactNumber}
                onChange={handleChange}
                required
                error={Boolean(errors.contactNumber)}
                helperText={errors.contactNumber}
                sx={{ borderColor: errors.contactNumber ? 'red' : 'inherit' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center">
                <Grid item>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    แนบไฟล์ประวัติส่วนตัว
                    <VisuallyHiddenInput
                      type="file"
                      onChange={handleFileChange}
                      required
                    />
                  </Button>
                </Grid>
                {isUploaded && (
                  <Grid item xs>
                    <Typography variant="subtitle1" color="success.main" sx={{ ml: 2 }}>
                      {filename}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              {errors.file && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.file}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}
