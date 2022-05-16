import styled from '@emotion/styled'
import { AccountCircle, Edit, Mail, Twitter } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRecoilState, useRecoilValue } from 'recoil'
import instance, {
  GetUserProfile,
  UpdateProfile,
} from '../../App/_helpers/playdustApi'
import * as store from '../store'
import type Profile from '../../App/_types/ProfileType'

const PaperContainer = styled(Paper)`
  display: flex;
  margin-bottom: 15px;
  gap: 20px;
  padding: 15px;
`

const IconContainer = styled(Box)`
  align-items: center;
  display: flex;
`

const TextContainer = styled(Typography)`
  max-width: 200px;
  word-break: break-word;
`

const BoxContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`

type ProfileProps = {
  publicKey: PublicKey
}

const ProfileInfo = ({ publicKey }: ProfileProps) => {
  const [edit, setEdit] = useState(false)
  const [errors, setErrors] = useState({
    email: '',
    twitter: '',
  })
  const [userProfile, setUserProfile] = useRecoilState(store.userProfile)
  const [cookies, setCookie] = useCookies(['authToken', 'nonce'])
  const ownedTokens = useRecoilValue(store.fetchOwned(publicKey))

  const saveProfile = (event: any) => {
    event.preventDefault()
    if (!errors.email && !errors.twitter) {
      UpdateProfile(userProfile, publicKey.toBase58(), cookies.nonce).then(
        () => {
          setEdit(false)
          setErrors({
            twitter: '',
            email: '',
          })
        }
      )
    }
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile({
      ...userProfile,
      [event.target.name]: event.target.value,
    })
  }

  useEffect(() => {
    if (ownedTokens.length) {
      setUserProfile({
        ...userProfile,
        picture: ownedTokens[0].offChainData.image,
      })
    }
  }, [ownedTokens])

  useEffect(() => {
    const pubKey = publicKey.toBase58()!
    GetUserProfile(pubKey, cookies.nonce).then((profile: Profile) => {
      setUserProfile(profile)
    })
  }, [instance])

  useEffect(() => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!userProfile.email) {
      return
    }
    if (!userProfile.email.match(emailRegex)) {
      setErrors({
        ...errors,
        email: 'Not an email',
      })
    } else {
      setErrors({
        ...errors,
        email: '',
      })
    }
  }, [userProfile.email])

  useEffect(() => {
    const twitterRegex = /^@\w+/
    if (!userProfile.twitter) {
      return
    }
    if (!userProfile.twitter.match(twitterRegex)) {
      setErrors({
        ...errors,
        twitter: 'Should start with @',
      })
    } else {
      setErrors({
        ...errors,
        twitter: '',
      })
    }
  }, [userProfile.twitter])

  return (
    <>
      <form onSubmit={saveProfile}>
        <PaperContainer elevation={3}>
          <IconContainer>
            {userProfile.picture ? (
              <Avatar
                sx={{ width: 128, height: 128 }}
                src={userProfile.picture}
              />
            ) : (
              <Avatar sx={{ width: 128, height: 128 }}>
                {publicKey.toBase58().substring(0, 4)}
              </Avatar>
            )}
          </IconContainer>
          <BoxContainer>
            {!edit && (
              <Typography variant="h6">
                <strong>Username</strong>
              </Typography>
            )}
            {edit ? (
              <TextField
                sx={{ marginBottom: 2, marginTop: 1 }}
                label="Username"
                name="username"
                value={userProfile.username}
                onChange={onChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircle />
                    </InputAdornment>
                  ),
                }}
              />
            ) : (
              <TextContainer>
                {userProfile.username ? userProfile.username : 'Unkown'}
              </TextContainer>
            )}
            {!edit && (
              <Typography sx={{ marginTop: 2 }} variant="h6">
                <strong>Bio</strong>
              </Typography>
            )}
            {edit ? (
              <TextField
                name="bio"
                value={userProfile.bio}
                onChange={onChange}
                label="Bio"
                multiline
                rows={4}
              />
            ) : (
              <TextContainer>
                {userProfile.bio ? userProfile.bio : 'Not set'}
              </TextContainer>
            )}
          </BoxContainer>
          <Box>
            <IconContainer sx={{ marginBottom: 2, marginTop: 1 }}>
              {edit ? (
                <TextField
                  label="Twitter"
                  name="twitter"
                  error={errors.twitter.length > 0}
                  helperText={errors.twitter}
                  value={userProfile.twitter}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Twitter />
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <>
                  {userProfile.twitter && (
                    <>
                      <Twitter /> {userProfile.twitter}
                    </>
                  )}
                </>
              )}
            </IconContainer>
            <IconContainer>
              {edit ? (
                <TextField
                  label="Email"
                  name="email"
                  error={errors.email.length > 0}
                  helperText={errors.email}
                  value={userProfile.email}
                  onChange={onChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Mail />
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <>
                  {userProfile.email && (
                    <>
                      <Mail /> {userProfile.email}
                    </>
                  )}
                </>
              )}
            </IconContainer>
            {edit && (
              <Button type="submit" variant="contained" sx={{ marginTop: 2 }}>
                Save changes
              </Button>
            )}
          </Box>
          {!edit && (
            <Box sx={{ heigth: 'fit-content' }}>
              <IconButton aria-label="edit" onClick={() => setEdit(true)}>
                <Edit />
              </IconButton>
            </Box>
          )}
        </PaperContainer>
      </form>
    </>
  )
}

export default ProfileInfo
