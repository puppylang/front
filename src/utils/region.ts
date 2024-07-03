export const formatRegionTitle = (address: string) => {
  const splitAddress = address.split(' ');
  return splitAddress[splitAddress.length - 1];
};
