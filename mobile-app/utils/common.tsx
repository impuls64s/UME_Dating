import * as Device from 'expo-device';


export const getDeviceInfo = async () => {
  const deviceTypeMap: Record<number, string> = {
    1: 'Phone',
    2: 'Tablet', 
    3: 'Desktop',
    4: 'TV'
  };

  const deviceType = await Device.getDeviceTypeAsync();

  return {
    deviceName: Device.deviceName,
    modelName: Device.modelName,
    brand: Device.brand,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceType: deviceTypeMap[deviceType] || 'Unknown',
    deviceTypeCode: deviceType,
    isDevice: Device.isDevice,
  };
};
