export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePassword = (password) => {
  return password && password.length >= 6
}

export const validateCoordinates = (latitude, longitude) => {
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180
}

export const validateFarmSize = (size) => {
  return size > 0 && size <= 10000
}

export const validateSoilData = (soilData) => {
  const { ph, nitrogen, phosphorus, potassium } = soilData
  return ph >= 0 && ph <= 14 && nitrogen >= 0 && phosphorus >= 0 && potassium >= 0
}
