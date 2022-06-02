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
import { useRecoilState, useResetRecoilState } from 'recoil';
import UserProfileType from '../../../../_types/UserProfileType';
import userProfileForAddressAtom from './_atoms/userProfileForAddressAtom';
import userProfileFormAtom from './_atoms/userProfileFormAtom';

type FormFieldProps = Omit<TextFieldProps, 'name'> & {
  name: keyof UserProfileType;
  Icon?: SvgIconComponent;
  validate?: (value: string) => boolean;
};

const formFields: FormFieldProps[] = [
  {
    name: 'username',
    placeholder: 'Username',
    validate: (value) => !!value,
  },
  {
    name: 'bio',
    placeholder: 'Bio',
    multiline: true,
  },
  {
    name: 'email',
    placeholder: 'Email',
    Icon: Mail,
    validate: (value) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value),
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
    validate: (value) => !value || /(?<!\w)@[\w+]{1,15}\b/.test(value),
  },
];

function UserProfileForm() {
  const [userProfile, setUserProfile] = useRecoilState(
    userProfileForAddressAtom
  );
  const [userProfileForm, setUserProfileForm] =
    useRecoilState(userProfileFormAtom);
  const resetUserProfileForm = useResetRecoilState(userProfileFormAtom);

  if (!userProfileForm.edit) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserProfileForm((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        [name]:
          name === 'twitterUsername' && !!value && !value.startsWith('@')
            ? `@${value}`
            : value,
      },
    }));
  };

  const handleSave = () => {
    if (
      formFields.some(
        ({ name }) =>
          name in userProfileForm.state &&
          userProfileForm.state[name] !== userProfile[name]
      )
    ) {
      // call api
      setUserProfile((prev) => ({ ...prev, ...userProfileForm.state }));
    }
    resetUserProfileForm();
  };

  const formErrors = formFields
    .filter((formField) => formField.validate)
    .reduce<Partial<UserProfileType>>(
      (prev, { name, validate, placeholder = '' }) =>
        validate?.((userProfileForm.state && userProfileForm.state[name]) ?? '')
          ? prev
          : {
              ...prev,
              [name]: `${placeholder} is invalid`,
            },
      {}
    );

  return (
    <>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        {formFields.map(
          ({ Icon, validate, ...props }: FormFieldProps, index) => (
            <TextField
              {...props}
              key={props.name}
              error={!!formErrors[props.name]}
              helperText={formErrors[props.name]}
              size="small"
              sx={{ mt: 2 * +!!index }}
              label={props.placeholder}
              value={
                (userProfileForm.state && userProfileForm.state[props.name]) ??
                ''
              }
              onChange={handleChange}
              InputProps={{
                startAdornment: Icon && (
                  <InputAdornment sx={{ mt: -0.5 }} position="start">
                    <Icon />
                  </InputAdornment>
                ),
              }}
            />
          )
        )}
      </CardContent>
      <CardActions sx={{ ml: 1 }}>
        <Button
          disabled={!!Object.keys(formErrors).length}
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
