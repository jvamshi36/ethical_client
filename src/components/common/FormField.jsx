import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  Switch,
  RadioGroup,
  Radio,
  Box
} from '@mui/material';

const FormField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error = null,
  helperText = '',
  fullWidth = true,
  disabled = false,
  options = [],
  multiple = false,
  size = 'medium',
  variant = 'outlined',
  margin = 'normal',
  className = '',
  autoFocus = false,
  placeholder = '',
  minValue,
  maxValue,
  rows,
  InputProps,
  ...props
}) => {
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <FormControl
            fullWidth={fullWidth}
            required={required}
            error={!!error}
            disabled={disabled}
            size={size}
            variant={variant}
            margin={margin}
            className={className}
          >
            <InputLabel id={`${id}-label`}>{label}</InputLabel>
            <Select
              labelId={`${id}-label`}
              id={id}
              name={name}
              value={value}
              onChange={onChange}
              label={label}
              multiple={multiple}
              {...props}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControlLabel
            control={
              <Checkbox
                id={id}
                name={name}
                checked={!!value}
                onChange={onChange}
                disabled={disabled}
                size={size}
                {...props}
              />
            }
            label={label}
            className={className}
          />
        );

      case 'switch':
        return (
          <FormControlLabel
            control={
              <Switch
                id={id}
                name={name}
                checked={!!value}
                onChange={onChange}
                disabled={disabled}
                size={size}
                {...props}
              />
            }
            label={label}
            className={className}
          />
        );

      case 'radio':
        return (
          <FormControl
            component="fieldset"
            fullWidth={fullWidth}
            required={required}
            error={!!error}
            disabled={disabled}
            margin={margin}
            className={className}
          >
            <FormControlLabel
              control={
                <RadioGroup
                  id={id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  {...props}
                >
                  {options.map((option) => (
                    <FormControlLabel
                      key={option.value}
                      value={option.value}
                      control={<Radio size={size} />}
                      label={option.label}
                    />
                  ))}
                </RadioGroup>
              }
              label={label}
            />
            {(error || helperText) && (
              <FormHelperText>{error || helperText}</FormHelperText>
            )}
          </FormControl>
        );

      case 'textarea':
        return (
          <TextField
            id={id}
            name={name}
            label={label}
            value={value}
            onChange={onChange}
            required={required}
            error={!!error}
            helperText={error || helperText}
            fullWidth={fullWidth}
            disabled={disabled}
            size={size}
            variant={variant}
            margin={margin}
            className={className}
            autoFocus={autoFocus}
            placeholder={placeholder}
            multiline
            rows={rows || 4}
            InputProps={InputProps}
            {...props}
          />
        );

      case 'number':
        return (
          <TextField
            id={id}
            name={name}
            label={label}
            type="number"
            value={value}
            onChange={onChange}
            required={required}
            error={!!error}
            helperText={error || helperText}
            fullWidth={fullWidth}
            disabled={disabled}
            size={size}
            variant={variant}
            margin={margin}
            className={className}
            autoFocus={autoFocus}
            placeholder={placeholder}
            InputProps={InputProps}
            inputProps={{
              min: minValue,
              max: maxValue,
              ...props.inputProps
            }}
            {...props}
          />
        );

      default:
        return (
          <TextField
            id={id}
            name={name}
            label={label}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            error={!!error}
            helperText={error || helperText}
            fullWidth={fullWidth}
            disabled={disabled}
            size={size}
            variant={variant}
            margin={margin}
            className={className}
            autoFocus={autoFocus}
            placeholder={placeholder}
            InputProps={InputProps}
            {...props}
          />
        );
    }
  };

  return <Box className="form-field-container">{renderField()}</Box>;
};

export default FormField;