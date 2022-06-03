import {
  AccountCircle,
  Mail,
  SvgIconComponent,
  Twitter,
} from '@mui/icons-material';
import {
  Button,
  CardActions,
  CardContent,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import UserProfileType from '../../../../_types/UserProfileType';
import userProfileAtom from './_atoms/userProfileAtom';
import userProfileFormAtom from './_atoms/userProfileFormAtom';

type FormFieldProps = Omit<TextFieldProps, 'name'> & {
  name: keyof UserProfileType;
  Icon?: SvgIconComponent;
  validate?: (value: string) => boolean;
};

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const twitterRegex = /(?<!\w)@[\w+]{1,15}\b/;

const formFields: FormFieldProps[] = [
  {
    name: 'username',
    placeholder: 'Username',
    required: true,
  },
  {
    name: 'email',
    placeholder: 'Email',
    required: true,
    Icon: Mail,
    validate: (value) => emailRegex.test(value),
  },
  {
    name: 'bio',
    placeholder: 'Bio',
    multiline: true,
  },
  {
    name: 'discordUsername',
    placeholder: 'Discord',
    Icon: AccountCircle,
  },
  {
    name: 'twitterUsername',
    placeholder: 'Twitter',
    Icon: Twitter,
    validate: (value) => !value || twitterRegex.test(value),
  },
];

function UserProfileForm() {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const userProfileForm = useRecoilValue(userProfileFormAtom);
  const resetUserProfileForm = useResetRecoilState(userProfileFormAtom);

  if (!userProfileForm.edit) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserProfile((prev) => ({
      ...prev,
      [name]:
        name === 'twitterUsername' && !!value && !value.startsWith('@')
          ? `@${value}`
          : value,
    }));
  };

  const handleSave = () => {
    const keys: FormFieldProps['name'][] = [
      ...formFields.map(({ name }) => name),
      'profilePictureMintAddress',
    ];
    // const hasChanges = keys.some(
    //   (key) => userProfile[key] !== userProfile[key]
    // );
    const hasChanges = true;

    if (hasChanges) {
      // call api
      // update appProfile
    }
    // maybe reset userProfileAtom
    resetUserProfileForm();
  };

  const invalidFields = formFields
    .filter(({ name, required, validate }) => {
      if (required && !userProfile[name]) {
        return true;
      }

      if (validate && !validate(userProfile[name] ?? '')) {
        return true;
      }

      return false;
    })
    .map(({ name }) => name);

  return (
    <>
      <CardContent>
        {formFields.map(({ Icon, validate, ...props }: FormFieldProps) => {
          const value = userProfile[props.name] ?? '';
          const errorText = invalidFields.includes(props.name)
            ? `${props.placeholder || props.name} is ${
                props.required && !value ? 'required' : 'invalid'
              }`
            : '';

          return (
            <TextField
              {...props}
              key={props.name}
              sx={{ ...props.sx, mt: 1, mb: 1 }}
              fullWidth={true}
              error={!!errorText}
              helperText={errorText}
              size="small"
              label={props.placeholder}
              value={value}
              onChange={handleChange}
              InputProps={{
                startAdornment: Icon && (
                  <InputAdornment sx={{ mt: -0.5 }} position="start">
                    <Icon />
                  </InputAdornment>
                ),
              }}
            />
          );
        })}
      </CardContent>
      <CardActions sx={{ ml: 1 }}>
        <Button
          disabled={!!invalidFields.length}
          variant="contained"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button variant="contained" onClick={resetUserProfileForm}>
          Cancel
        </Button>
      </CardActions>
    </>
  );
}

export default UserProfileForm;
