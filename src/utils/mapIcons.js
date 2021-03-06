import Leaflet from 'leaflet';

export const newTargetIcon = new Leaflet.Icon({
  iconUrl: require('assets/newTargetMarker.png'),
  iconSize: [45, 53],
  iconAnchor: [22.5, 53],
});

export const getLeafletIconByTopic = (topic) => {
  let url = null;
  let size = [0, 0];
  let anchor = [0, 0];
  switch (topic) {
    case 'football':
      url = require('assets/topicIcons/footballIcon.png');
      size = [14, 13];
      anchor = [7, 6.5];
      break;
    case 'travel':
      url = require('assets/topicIcons/travelIcon.png');
      size = [15, 19];
      anchor = [7.5, 9.5];
      break;
    case 'politics':
      url = require('assets/topicIcons/politicsIcon.png');
      size = [16, 17];
      anchor = [8, 8.5];
      break;
    case 'art':
      url = require('assets/topicIcons/artIcon.png');
      size = [17, 19];
      anchor = [8.5, 9.5];
      break;
    case 'dating':
      url = require('assets/topicIcons/datingIcon.png');
      size = [16, 15];
      anchor = [8, 7.5];
      break;
    case 'music':
      url = require('assets/topicIcons/musicIcon.png');
      size = [15, 15];
      anchor = [7.5, 7.5];
      break;
    case 'movies':
      url = require('assets/topicIcons/moviesIcon.png');
      size = [15, 13];
      anchor = [7.5, 6.5];
      break;
    case 'series':
      url = require('assets/topicIcons/seriesIcon.png');
      size = [14, 14];
      anchor = [7, 7];
      break;
    default:
      url = require('assets/topicIcons/foodIcon.png');
      size = [16, 13];
      anchor = [8, 6.5];
      break;
  }
  return new Leaflet.Icon({
    iconUrl: url,
    iconSize: size,
    iconAnchor: anchor,
  });
};
