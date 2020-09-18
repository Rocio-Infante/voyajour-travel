// import our actiontypes from constants/actionsTypes;
import axios from 'axios';
import * as types from '../constants/actionTypes';
// our initialState for this reducer needs some cleaning up. We have this one
// and formReducer which are combined in the index.js file with the combineReducer method

// note, because of the way we set up index.js, this state is accesssed w/ state.trips;
const initialState = {
  activeLocationId: 0,
  count: 0,
  // trips contains objects with keys: id(unique to location), location(str), country(str)
  trips: [
    // {
    //   locationId: 1,
    //   location: 'LA',
    //   country: 'USA',
    // },
    // {
    //   locationId: 2,
    //   location: 'NYC',
    //   country: 'USA',
    // },
    // {
    //   locationId: 3,
    //   location: 'Munich',
    //   country: 'GERMANY',
    // },
    // {
    //   locaitonId: 4,
    //   location: 'Paris',
    //   country: 'FRANCE',
    // },
  ],
  // activities contains objects with keys: description, notes, address, link, (strs); completed(bool); locationID (num correlating to location; id (num, unique to activity))
  activities: [],
  //holds all activities so that
  activityStore: [
    // {
    //   location_id: 1,
    //   description: 'Go to Guisados',
    //   notes: 'get the al pastor',
    //   address: '123 Sepulveda',
    //   link: 'www.guisados.com',
    //   completed: false,
    // },
    // {
    //   location_id: 1,
    //   description: 'Guggenheim',
    //   notes: 'Dont forget a coat',
    //   address: '456 Tram on a Hill way',
    //   link: 'guggenheim.public',
    //   completed: false,
    // },
    // {
    //   location_id: 2,
    //   description: 'Oktoberfest',
    //   notes: 'Hofbräu House',
    //   address: '2398 Straße Weiß',
    //   link: 'hofbrau.de',
    //   completed: false,
    // },
    // {
    //   location_id: 3,
    //   description: 'Eiffel Tower',
    //   notes: 'Do things there',
    //   address: '2983 Rue Tor Eifel',
    //   link: 'www.eiffel.fr',
    //   completed: false,
    // },
  ],
};

const travelReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ADD_COUNT: {
      const count = state.count + 1;
      return { ...state, count };
    }

    // populate activites that are returned on user login
    case types.POPULATE_ACTIVITIES: {
      const newActivities = action.payload.activities;
      // location will be an object with _id, name, country, user_id
      const newLocations = action.payload.locations;
      return {
        ...state,
        activities: newActivities,
        activityStore: newActivities,
        trips: newLocations,
      };
    }

    case types.GET_ACTIVITIES: {
      const { payload } = action;
      // create new var to hold new active location id
      const newActiveLocationId = payload;
      // filter through relevant activities and update state.trips.activities to only items that match activeLocationId
      const relevantActivities = state.activityStore.filter(
        (activity) => newActiveLocationId === parseInt(activity.location_id)
      );
      console.log(relevantActivities);
      // return copy of state object with state spread out, set activities to filtered activities and activeLocationId to new activeLocationId
      return {
        ...state,
        activities: relevantActivities,
        activeLocationId: newActiveLocationId,
      };
    }
    // this action sends a request to our server.
    case types.ADD_NEW_LOCATION: {
      console.log('inside travel reducer, state.trips:', state.trips);
      const newTrips = state.trips.slice();
      newTrips.push(action.payload);
      return {
        ...state,
        trips: newTrips,
        activeLocationId: newTrips[newTrips.length - 1].locationId,
      };
    }

    // adds activity card to activities array after being being saved to DB in storeNewActivity thunk in actions.js
    case types.ADD_ACTIVITIES: {
      const newActivities = state.activities.slice();
      const newActivityStore = state.activityStore.slice();
      newActivities.push(action.payload);
      newActivityStore.push(action.payload);
      return {
        ...state,
        activities: newActivities,
        activityStore: newActivityStore,
      };
    }

    // removes location card from locations array after being being removed from DB in removeLocationCard thunk in actions.js
    case types.DELETE_ACTIVITY_CARD: {
      console.log(
        `inside delete_activity_card travelreducer: ${action.payload}`
      );
      const activityId = action.payload;
      const updatedActivities = state.activityStore.filter(
        (activity) => activity._id !== activityId
      );
      const updatedActivityStore = state.activityStore.filter(
        (activity) => activity._id !== activityId
      );
      return {
        ...state,
        activities: updatedActivities,
        activityStore: updatedActivityStore,
      };
    }

    // removes location card from locations array after being being removed from DB in removeLocationCard thunk in actions.js
    case types.DELETE_LOCATION_CARD: {
      const locationId = action.payload;
      const updatedTrips = state.trips.filter(
        (trip) => trip._id !== locationId
      );
      return {
        ...state,
        trips: updatedTrips,
      };
    }

    default:
      return state;
  }
};

export default travelReducer;
