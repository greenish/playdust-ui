import {
  AccountCircle,
  AlternateEmail,
  Mail,
  SvgIconComponent,
} from '@mui/icons-material';
import {
  Box,
  Button,
  CardActions,
  CardContent,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import safePromise from '../../../../_helpers/safePromise';
import useProfileState from '../../../_hooks/useProfileState';
import PlaydustProfileType from '../../../_types/PlaydustProfileType';
import userProfileEditAtom from './_atoms/userProfileEditAtom';
import profileApi from './_helpers/profileApi';
import useAuth from '../../../../_hooks/useAuth';
import useConnectedWallet from '../../../../_hooks/useConnectedWallet';
import UserProfileAvatar from './_sharedComponents/UserProfileAvatar';

type FormFieldProps = Omit<TextFieldProps, 'name'> & {
  name: keyof PlaydustProfileType;
  Icon?: SvgIconComponent;
  validate?: (value: string) => boolean;
};

const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const twitterRegex = /^[a-zA-Z0-9_]{1,15}$/;

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
    Icon: AlternateEmail,
    validate: (value) => !value || twitterRegex.test(value),
  },
];

function UserProfileForm() {
  const auth = useAuth();
  const connectedWallet = useConnectedWallet();
  const setEdit = useSetRecoilState(userProfileEditAtom);
  const [userProfile, setUserProfile] = useProfileState();

  const [formState, setFormState] = useState<PlaydustProfileType | null>(
    userProfile
  );

  if (!formState || !userProfile) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setFormState(
      (prev) =>
        prev && {
          ...prev,
          [event.target.name]: event.target.value,
        }
    );

  const handleCancel = () => {
    setEdit(false);
    setFormState(null);
  };

  const handleSave = async () => {
    const keys: FormFieldProps['name'][] = [
      ...formFields.map(({ name }) => name),
      'profilePictureMintAddress',
    ];
    const hasChanges = keys.some((key) => formState[key] !== userProfile[key]);

    if (!hasChanges) {
      return handleCancel();
    }

    const tokens = await auth.getTokens();

    if (tokens && connectedWallet) {
      await profileApi.post(`/update/${connectedWallet}`, formState, {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      setUserProfile(formState);
      handleCancel();
    }
  };

  const invalidFields = formFields
    .filter(({ name, required, validate }) => {
      if (required && !formState[name]) {
        return true;
      }

      if (validate && !validate(formState[name] ?? '')) {
        return true;
      }

      return false;
    })
    .map(({ name }) => name);

  return (
    <Box sx={{ display: 'flex' }}>
      <UserProfileAvatar
        value={formState.profilePictureMintAddress}
        onChange={(profilePictureMintAddress) =>
          setFormState((prev) => prev && { ...prev, profilePictureMintAddress })
        }
      />
      <CardContent>
        {formFields.map(({ Icon, validate, ...props }: FormFieldProps) => {
          const value = formState[props.name] ?? '';
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
        <CardActions sx={{ p: 0, mt: 2 }}>
          <Button
            disabled={!!invalidFields.length}
            variant="contained"
            onClick={() => safePromise(handleSave())}
          >
            Save
          </Button>
          <Button variant="contained" onClick={handleCancel}>
            Cancel
          </Button>
        </CardActions>
      </CardContent>
    </Box>
  );
}

export default UserProfileForm;
