import React, { useState, useCallback } from 'react';
import { TextField, Button, MenuItem, Typography, Box, Grid } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';

const positions = [
  { value: 'Front-end Trainee', label: 'Front-end Trainee' },
  { value: 'HR Trainee', label: 'HR Trainee' },
  { value: 'Application Tester Trainee', label: 'Application Tester Trainee' }
];

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
    email: '',
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        return !value ? 'จำเป็นต้องใส่ชื่อ' : !/^\D*$/.test(value) ? 'ชื่อต้องประกอบด้วยตัวอักษรเท่านั้น' : '';
      case 'position':
        return !value ? 'กรุณาเลือกตำแหน่ง' : '';
      case 'birthDate':
        return !value ? 'กรุณาระบุวันเดือนปีเกิด' : value > new Date() ? 'วันเกิดต้องไม่เกินวันปัจจุบัน' : '';
      case 'gpa':
        return !value ? 'จำเป็นต้องใส่เกรดเฉลี่ย' : (isNaN(value) || value < 0 || value > 4) ? 'เกรดเฉลี่ยต้องอยู่ระหว่าง 0 ถึง 4' : '';
      case 'address':
        return !value ? 'จำเป็นต้องใส่ที่อยู่' : '';
      case 'email':
        return !value ? 'จำเป็นต้องใส่อีเมล' : !/\S+@\S+\.\S+/.test(value) ? 'รูปแบบอีเมลไม่ถูกต้อง' : '';
      case 'contactNumber':
        return !value ? 'จำเป็นต้องใส่หมายเลขเบอร์โทรศัพท์' : !/^[0-9]{10}$/.test(value) ? 'หมายเลขเบอร์โทรศัพท์ต้องประกอบด้วยตัวเลข 10 หลัก' : '';
      case 'file':
        return !value ? 'กรุณาแนบไฟล์ประวัติส่วนตัว' : '';
      default:
        return '';
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleDateChange = (date) => {
    setFormValues(prev => ({ ...prev, birthDate: date }));
    if (touched.birthDate) {
      setErrors(prev => ({ ...prev, birthDate: validateField('birthDate', date) }));
    }
  };

  const handleDateBlur = () => {
    setTouched(prev => ({ ...prev, birthDate: true }));
    setErrors(prev => ({ ...prev, birthDate: validateField('birthDate', formValues.birthDate) }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormValues(prev => ({ ...prev, file: file }));
    setTouched(prev => ({ ...prev, file: true }));
    setErrors(prev => ({ ...prev, file: validateField('file', file) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Touch all fields
    const allTouched = Object.keys(formValues).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    // Validate all fields
    const formErrors = Object.keys(formValues).reduce((acc, key) => ({
      ...acc,
      [key]: validateField(key, formValues[key])
    }), {});
    setErrors(formErrors);

    // Check if the form is valid
    const isValid = Object.values(formErrors).every(x => x === '');
    
    if (isValid) {
      try {
        const formData = new FormData();
        Object.keys(formValues).forEach(key => {
          formData.append(key, formValues[key]);
        });

        const response = await axios.post('http://localhost:5000/submit', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          alert('Form Submission Successful');
        } else {
          alert('Form submission failed');
        }
      } catch (error) {
        alert('Form submission error: ' + error.message);
      }
    }
  };

  return (
    <Box sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
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
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
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
                onBlur={handleBlur}
                error={touched.position && Boolean(errors.position)}
                helperText={touched.position && errors.position}
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
                  onClose={handleDateBlur}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: touched.birthDate && Boolean(errors.birthDate),
                      helperText: touched.birthDate && errors.birthDate,
                    },
                  }}
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
                onBlur={handleBlur}
                error={touched.gpa && Boolean(errors.gpa)}
                helperText={touched.gpa && errors.gpa}
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
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                variant="outlined"
                value={formValues.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
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
                onBlur={handleBlur}
                error={touched.contactNumber && Boolean(errors.contactNumber)}
                helperText={touched.contactNumber && errors.contactNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUploadIcon />}
              >
                แนบไฟล์ประวัติส่วนตัว
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileChange}
                />
              </Button>
              {formValues.file && (
                <Typography variant="subtitle1" color="success.main" sx={{ ml: 2 }}>
                  {formValues.file.name}
                </Typography>
              )}
              {touched.file && errors.file && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.file}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
}