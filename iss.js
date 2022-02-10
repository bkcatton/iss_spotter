/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
 const request = require('request');
 const request = require('request-promise');

 const fetchMyIP = function(callback) { 
  // use request to fetch IP address from JSON API
  request((error, response, body)=>{
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null)
      return;
    }
    const ipAddress = JSON.parse(body).ip;
    callback(null, ipAddress);
  });
};

const fetchCoordsByIp = function (ipAddress, callback) {
  request(`https://freegeoip.app/json/${ipAddress}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const {latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });
  });
};
const fetchISSFlyOverTimes = function(coords, callback) {
  // ...
  request(`https://iss-pass.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS times ${body}`), null);
      return;
    }

    const passes = JSON.parse(body);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
}




module.exports = { fetchMyIP };
module.exports = { fetchCoordsByIp };
module.exports = { fetchISSFlyOverTimes };
module.exports = { nextISSTimesForMyLocation };
