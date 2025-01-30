'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Paper,
    FormControl,
    Card,
    CardContent,
} from '@mui/material';
import { useRouter } from 'next/navigation';

interface FormData {
    projectName: string;
    niche: string;
}

interface FormErrors {
    projectName: boolean;
    niche: boolean;
}

const CreateAvatar = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        projectName: '',
        niche: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        projectName: false,
        niche: false
    });

    const niches = [
        { value: 'health', label: 'Health' },
        { value: 'education', label: 'Education' },
        { value: 'beauty', label: 'Beauty' },
        { value: 'fashion', label: 'Fashion' },
        { value: 'religion', label: 'Religion' },
        { value: 'hotel-restaurant', label: 'Hotel & Restaurant' },
        { value: 'real-estate', label: 'Real Estate' },
        { value: 'ecommerce', label: 'E-commerce' },
        { value: 'sport', label: 'Sport' },
        { value: 'legal', label: 'Legal' },
        { value: 'taxi', label: 'Taxi' },
        { value: 'radio', label: 'Radio' },
        { value: 'dating', label: 'Dating' },
        { value: 'local-business', label: 'Local Business' },
        { value: 'automotive', label: 'Automotive' },
        { value: 'others', label: 'Others' }
    ];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: false
        }));
    };

    const handleNext = () => {
        // Validate fields
        const newErrors = {
            projectName: !formData.projectName.trim(),
            niche: !formData.niche
        };

        setErrors(newErrors);

        // If no errors, proceed to template selection
        if (!Object.values(newErrors).some(error => error)) {
            // Store the form data if needed
            localStorage.setItem('avatarProject', JSON.stringify(formData));
            // Update the route to match the new structure
            router.push('/projects/create-avatar/select-avatar-template');
        }
    };

    // Check if both fields are filled
    const isFormValid = formData.projectName.trim() && formData.niche;

    return (
        <Box sx={{ 
            p: 2,
            maxWidth: 500,
            mx: 'auto',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'white'
        }}>
            <Card 
                sx={{ 
                    width: '100%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                }}
            >
                <CardContent>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            p: 3,
                            borderRadius: 2,
                            width: '100%',
                            bgcolor: 'white',
                            boxShadow: 'none'
                        }}
                    >
                        <Typography 
                            variant="h4" 
                            gutterBottom 
                            sx={{ 
                                mb: 2,
                                color: '#1C2536',
                                fontSize: '1.5rem',
                                fontWeight: 500
                            }}
                        >
                            Create Interactive Avatar
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                label="Project Name"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                error={errors.projectName}
                                helperText={errors.projectName ? "Project name is required" : ""}
                                fullWidth
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'white',
                                        '&:hover fieldset': {
                                            borderColor: '#6366F1',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#6B7280',
                                    },
                                }}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <TextField
                                select
                                label="Select Niche"
                                name="niche"
                                value={formData.niche}
                                onChange={handleChange}
                                error={errors.niche}
                                helperText={errors.niche ? "Please select a niche" : ""}
                                fullWidth
                                size="small"
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        bgcolor: 'white',
                                        '&:hover fieldset': {
                                            borderColor: '#6366F1',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: '#6B7280',
                                    },
                                }}
                            >
                                {niches.map((niche) => (
                                    <MenuItem key={niche.value} value={niche.value}>
                                        {niche.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>

                        {isFormValid && (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                fullWidth
                                sx={{
                                    mt: 1,
                                    bgcolor: '#1D2136',
                                    '&:hover': {
                                        bgcolor: '#282d4a',
                                    },
                                    textTransform: 'none',
                                    py: 1
                                }}
                            >
                                Next
                            </Button>
                        )}
                    </Paper>
                </CardContent>
            </Card>
        </Box>
    );
};

export default CreateAvatar; 