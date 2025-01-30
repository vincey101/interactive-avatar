'use client';

import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActionArea,
    Grid,
    Paper,
    IconButton
} from '@mui/material';
import {
    FileCopy as TemplateIcon,
    CloudUpload as UploadIcon,
    Videocam as WebcamIcon,
    ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';

const SelectAvatarTemplate = () => {
    const router = useRouter();

    const handleBack = () => {
        router.push('/projects/create-avatar');
    };

    const options = [
        {
            title: 'Select Template',
            icon: <TemplateIcon sx={{ fontSize: 32, color: '#fff' }}/>,
            description: 'Choose from our pre-made avatar templates',
            path: '/projects/create-avatar/avatar-template-library'
        },
        {
            title: 'Upload Footage',
            icon: <UploadIcon sx={{ fontSize: 32, color: '#fff' }}/>,
            description: 'Upload your own video footage',
            path: '/projects/create-avatar/avatar-upload',
            instructionLink: true
        },
        {
            title: 'Record via Webcam',
            icon: <WebcamIcon sx={{ fontSize: 32, color: '#fff' }}/>,
            description: 'Record yourself using your webcam',
            path: '/projects/create-avatar/avatar-webcam',
            instructionLink: true
        }
    ];

    return (
        <Box sx={{ 
            p: 3, 
            pt: 8,
            maxWidth: 1200, 
            mx: 'auto',
            minHeight: '100vh',
            bgcolor: 'white'
        }}>
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    bgcolor: 'white',
                    mt: 4
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                    <IconButton 
                        onClick={handleBack}
                        sx={{ 
                            mr: 2,
                            color: '#1D2136',
                            '&:hover': {
                                backgroundColor: 'rgba(29, 33, 54, 0.04)'
                            }
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ color: '#1C2536' }}>
                        Choose Creation Method
                    </Typography>
                </Box>

                <Grid container spacing={3}>
                    {options.map((option, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)'
                                    }
                                }}
                            >
                                <CardActionArea 
                                    onClick={() => router.push(option.path)}
                                    sx={{ height: '100%', p: 2 }}
                                >
                                    <CardContent sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        height: '100%'
                                    }}>
                                        <Box 
                                            sx={{ 
                                                mb: 2,
                                                p: 2,
                                                borderRadius: '50%',
                                                backgroundColor: '#1D2136',
                                                width: 60,
                                                height: 60,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {option.icon}
                                        </Box>
                                        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
                                            {option.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {option.description}
                                        </Typography>
                                        {option.instructionLink && (
                                            <Typography 
                                                component="span"
                                                variant="body2" 
                                                sx={{ 
                                                    color: '#6366F1',
                                                    mt: 2,
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                                onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                                                    e.stopPropagation();
                                                    router.push('/projects/create-avatar/avatar-instructions');
                                                }}
                                            >
                                                View detailed instructions here
                                            </Typography>
                                        )}
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
};

export default SelectAvatarTemplate; 