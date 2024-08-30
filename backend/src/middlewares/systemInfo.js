const useragent = require('useragent');
const geoip = require('geoip-lite');

const systemInfoMiddleware = (req, res, next) => {
  const agent = useragent.parse(req.headers['user-agent']);
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);

  req.systemInfo = {
    os: agent.os.family,  
    browser: agent.family, 
    country: geo ? geo.country : 'Unknown',
    ip: ip
  };

  next();
};

module.exports = systemInfoMiddleware;
