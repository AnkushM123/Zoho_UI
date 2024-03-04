function DecodeJwt() {
  const token = localStorage.getItem('authToken')
  let jwtData = token.split('.')[1]
  let decodedJwtJsonData = window.atob(jwtData)
  let decodedJwtData = JSON.parse(decodedJwtJsonData)

  return decodedJwtData;
}

export default DecodeJwt;