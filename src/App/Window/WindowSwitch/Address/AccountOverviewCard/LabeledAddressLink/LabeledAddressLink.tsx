import { PublicKey } from '@solana/web3.js';
import React from 'react';
import ExplorerLink from '../_sharedComponents/ExplorerLink/ExplorerLink';
import ExplorerLinkDisplayPropsType from '../_types/ExplorerLinkDisplayPropsType';
import useAddressLabel from './_hooks/useAddressLabel';

interface LabeledAddressLinkBaseProps {
  pubkey: PublicKey | string;
}

type LabeledAddressLinkProps = LabeledAddressLinkBaseProps &
  ExplorerLinkDisplayPropsType;

function LabeledAddressLink({
  pubkey,
  ...displayProps
}: LabeledAddressLinkProps) {
  const getAddressLabel = useAddressLabel();

  // In dev, recoil freezes all values returned by atoms/selectors
  // However, toBase58() - in certain circumstances, namely for the System Program pubkey
  // needs to modify the pubkey object, which if frozen will throw,
  // so we catch and JSON.stringify as a fallback

  let to;

  try {
    to = pubkey instanceof PublicKey ? pubkey.toBase58() : pubkey;
  } catch (err) {
    to = JSON.stringify(pubkey);
  }

  const label = getAddressLabel(to);

  return (
    <ExplorerLink type="address" to={to} label={label} {...displayProps} />
  );
}

export default LabeledAddressLink;
