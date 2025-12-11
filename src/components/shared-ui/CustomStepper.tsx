import type { ComponentType } from 'react';
import React from 'react';
import type { StepConnectorProps, StepIconProps as MuiStepIconProps } from '@mui/material';
import { Stepper, Step, StepLabel, StepConnector, Box, styled } from '@mui/material';

export type StepItem = {
  value: string | number;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
};

export type StepperProps = {
  steps: StepItem[];
  activeStep: number;
  setActiveStep?: (step: number) => void;
};

type CustomStepIconProps = MuiStepIconProps & {
  steps: StepItem[];
  clickable: boolean;
};

const CustomConnector = styled(StepConnector)<StepConnectorProps>(() => ({
  '&.MuiStepConnector-root': {
    marginTop: '4px',
  },
  '& .MuiStepConnector-line': {
    borderColor: '#2a4947',
    borderTopWidth: 2,
    borderRadius: 1,
  },
}));

const CustomStepIconRoot = styled('div')<{
  ownerState: { active: boolean; completed: boolean };
}>(({ ownerState }) => ({
  backgroundColor: ownerState.completed || ownerState.active ? '#2a4947' : 'white',
  zIndex: 1,
  color: ownerState.completed || ownerState.active ? 'white' : '#2a4947',
  width: 30,
  height: 30,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${ownerState.completed || ownerState.active ? '#002db3' : '#2a4947'}`,
  '& .MuiSvgIcon-root': {
    fontSize: '18px',
  },
}));

const CustomStepIcon: React.FC<CustomStepIconProps> = ({ active = false, completed = false, icon, steps, clickable }) => {
  const stepIndex = Number(icon) - 1;
  const StepIconComponent = steps[stepIndex]?.icon;

  return (
    <CustomStepIconRoot ownerState={{ completed, active }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: clickable ? '' : 'not-allowed',
          opacity: clickable ? 1 : 0.5,
          height: '100%',
          width: '100%',
        }}
      >
        <StepIconComponent size={15} />
      </Box>
    </CustomStepIconRoot>
  );
};

const CustomStepper: React.FC<StepperProps> = ({ steps, activeStep, setActiveStep }) => {
  return (
    <Stepper alternativeLabel activeStep={activeStep} connector={<CustomConnector />}>
      {steps.map((step, index) => {
        const clickable = index <= activeStep;
        const isActive = index === activeStep;
        return (
          <Step key={step.value} disabled={!isActive}>
            <StepLabel
              StepIconComponent={(props) => <CustomStepIcon {...props} clickable={clickable} steps={steps} />}
              onClick={() => isActive && setActiveStep?.(Number(step.value))}
              sx={{
                cursor: isActive ? 'pointer' : 'not-allowed',
                '& .MuiStepLabel-root .Mui-completed': { color: 'black' },
                '& .MuiStepLabel-root .Mui-active': { color: '#2a4947' },
                '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
                  color: '#2a4947',
                },
              }}
            >
              <Box sx={{ fontSize: '11px', fontFamily: 'sans-serif' }}>{step.label}</Box>
            </StepLabel>
          </Step>
        );
      })}
    </Stepper>
  );
};

export default CustomStepper;
