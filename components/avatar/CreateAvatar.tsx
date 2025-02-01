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
import { motion } from 'framer-motion';
import Image from 'next/image';
import { RocketLaunch, ChevronRight } from '@mui/icons-material';

interface FormData {
    projectName: string;
    niche: string;
    description: string;
}

interface FormErrors {
    projectName: boolean;
    niche: boolean;
    description: boolean;
}

const CreateAvatar = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        projectName: '',
        niche: '',
        description: ''
    });

    const [errors, setErrors] = useState<FormErrors>({
        projectName: false,
        niche: false,
        description: false
    });

    const niches = [
        { value: 'health', label: 'Health', icon: '🏥' },
        { value: 'education', label: 'Education', icon: '📚' },
        { value: 'beauty', label: 'Beauty', icon: '💄' },
        { value: 'fashion', label: 'Fashion', icon: '👗' },
        { value: 'religion', label: 'Religion', icon: '🕊️' },
        { value: 'hotel-restaurant', label: 'Hotel & Restaurant', icon: '🏨' },
        { value: 'real-estate', label: 'Real Estate', icon: '🏠' },
        { value: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
        { value: 'sport', label: 'Sport', icon: '⚽' },
        { value: 'legal', label: 'Legal', icon: '⚖️' },
        { value: 'taxi', label: 'Taxi', icon: '🚕' },
        { value: 'radio', label: 'Radio', icon: '📻' },
        { value: 'dating', label: 'Dating', icon: '❤️' },
        { value: 'local-business', label: 'Local Business', icon: '🏪' },
        { value: 'automotive', label: 'Automotive', icon: '🚗' },
        { value: 'others', label: 'Others', icon: '✨' }
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
        const newErrors = {
            projectName: !formData.projectName.trim(),
            niche: !formData.niche,
            description: !formData.description.trim()
        };

        setErrors(newErrors);

        if (!Object.values(newErrors).some(error => error)) {
            localStorage.setItem('avatarProject', JSON.stringify(formData));
            router.push('/projects/create-avatar/select-avatar-template');
        }
    };

    const isFormValid = formData.projectName.trim() && formData.niche && formData.description.trim();

    return (
        <Box 
            sx={{ 
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f6f7ff 0%, #ffffff 100%)',
                p: 3,
                overflow: 'hidden'
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '800px' }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    gap: 6,
                    justifyContent: 'center',
                    maxWidth: '900px',
                    mx: 'auto'
                }}>
                    {/* Left side - Form */}
                    <Card 
                        sx={{ 
                            width: '50%',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                            borderRadius: 3,
                            overflow: 'visible'
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ 
                                        p: 1, 
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <RocketLaunch sx={{ color: 'white', fontSize: 20 }} />
                                    </Box>
                                    <Typography 
                                        variant="h5" 
                                        sx={{ 
                                            color: '#1C2536',
                                            fontWeight: 600
                                        }}
                                    >
                                        Create Project
                                    </Typography>
                                </Box>

                                <Typography 
                                    sx={{ 
                                        mb: 3,
                                        color: '#6B7280',
                                        fontSize: '0.875rem'
                                    }}
                                >
                                    Start your journey by creating a streaming interactive human AI that will engage your audience and represent your brand.
                                    {/* Step 1 - Create Streaming Interactive AI Human */}

                                </Typography>

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <TextField
                                        label="Project Name"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleChange}
                                        error={errors.projectName}
                                        helperText={errors.projectName ? "Project name is required" : ""}
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: 'white',
                                                '&:hover fieldset': {
                                                    borderColor: '#6366F1',
                                                },
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
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: 'white',
                                                '&:hover fieldset': {
                                                    borderColor: '#6366F1',
                                                },
                                            },
                                        }}
                                    >
                                        {niches.map((niche) => (
                                            <MenuItem key={niche.value} value={niche.value}>
                                                <span style={{ marginRight: '8px' }}>{niche.icon}</span>
                                                {niche.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </FormControl>

                                <FormControl fullWidth sx={{ mb: 3 }}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        error={errors.description}
                                        helperText={errors.description ? "Description is required" : ""}
                                        placeholder="Write a short description about your product or service"
                                        size="small"
                                        multiline
                                        rows={3}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                bgcolor: 'white',
                                                '&:hover fieldset': {
                                                    borderColor: '#6366F1',
                                                },
                                            },
                                        }}
                                    />
                                </FormControl>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: isFormValid ? 1 : 0, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {isFormValid && (
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            fullWidth
                                            endIcon={<ChevronRight />}
                                            sx={{
                                                background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                                textTransform: 'none',
                                                py: 1,
                                                fontSize: '0.875rem',
                                                borderRadius: 2,
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #5457DC 0%, #1f2937 100%)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </motion.div>
                            </motion.div>
                        </CardContent>
                    </Card>

                    {/* Right side - Illustration/Info */}
                    <Box 
                        sx={{ 
                            width: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Card
                                sx={{
                                    p: 2.5,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(135deg, #6366F1 0%, #111827 100%)',
                                    color: 'white',
                                    borderRadius: 3
                                }}
                            >
                                <Box sx={{ position: 'relative', height: 160, mb: 2 }}>
                                    <Image
                                        src="/avatar-illustration.svg" // Add your illustration
                                        alt="Avatar Creation"
                                        layout="fill"
                                        objectFit="contain"
                                    />
                                </Box>
                                
                                <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 600 }}>
                                    Why Create Streaming Interactive Human AI?
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {[
                                        { title: 'Professional Templates', desc: 'Access pre-built templates from various professional fields' },
                                        { title: 'Custom Knowledge Base', desc: 'Add your own content through URL, text, or document upload' },
                                        { title: 'Emotional Intelligence', desc: 'Customize voice emotions to match your communication style' }
                                    ].map((item, index) => (
                                        <Box key={index} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                                            <Box 
                                                sx={{ 
                                                    width: 20, 
                                                    height: 20, 
                                                    borderRadius: '50%', 
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    flexShrink: 0,
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                                    {item.title}
                                                </Typography>
                                                <Typography sx={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                                    {item.desc}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Box>
                            </Card>
                        </motion.div>
                    </Box>
                </Box>
            </motion.div>
        </Box>
    );
};

export default CreateAvatar; 