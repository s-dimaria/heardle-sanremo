import { banWords } from "../game/Constants";
import { artists } from "../utils/artists";

interface artist {
  name: string
}

interface SpotifyResult {
  duration_ms: number
  artists: artist[]
  name: string
}

export interface SongOption {
  readonly value: string;
  readonly label: string;
}

export const getAccessToken = (): Promise<any> => {

  return new Promise<string>((resolve, reject) => {

    console.log("Load access...")

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic " + process.env.REACT_APP_SPOTIFY_API_KEY);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Cookie", "__Host-device_id=AQDPZSmHH_wn9eUQvhLOXgZ6dX2N_ADW-WOhrV5i0uBaLxJqODRvMyT9FeFAp7IZsoqpHUkWt94rWJMzQz6pblraDVkFMLAgEHA; sp_tr=false");

    var urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    fetch("https://accounts.spotify.com/api/token",
      {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      })
      .then(response => response.json())
      .then(result => {
        resolve(result.access_token);
      })
      .catch(error => {
        resolve("")
        console.log('error', error)
      });

  });

}

async function fetchTracks(inputValue: string, offset: number, token: string) {

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");

  const urlTrack = `https://api.spotify.com/v1/search?q=${inputValue}&type=track&market=IT&location=it-IT&limit=40&offset=${offset * 40}`;

  const response = await fetch(urlTrack, {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  });

  const data = await response.json();

  console.log('fetchTracks', data.tracks)
  return data.tracks ? data.tracks.items : undefined;
}

async function runSearch(inputValue: string, token: string) {
  let allResults: any[] = [];

  for (let i = 0; i < 10; i++) {
    const items = await fetchTracks(inputValue, i, token);

    if (items === undefined)
      break

    allResults = [...allResults, ...items];
  }

  const combinedResult = { items: allResults };

  return combinedResult
}

export const getList = (token: string, inputValue: string, callback: (res: SongOption[]) => void) => {

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");

  if (inputValue != "") {
    const requestTrack = runSearch(inputValue, token);

    requestTrack
      .then(response => {

        console.warn("Searching...")
        let mapTracks = new Map<string, string>()
        let tracks: SongOption[] = []

        if (response && response.items) {

          if (response.items.length === 0) {
            callback(tracks)
            return
          }

          response.items
            .filter((track: any) => (track && track.artists[0].name.indexOf("unknown") === -1 && track.name.indexOf("unknown") === -1))
            .map((track: SpotifyResult) => {

              var value = new RegExp(banWords.join('|')).test(track.name.toLowerCase());

              if (artists.includes(track.artists[0].name.toLowerCase()) && !value) {
                let id = track.artists[0].name + track.name;
                id = id.replaceAll(" ", "");
                // let id = track.duration_ms.toString() + track.artists[0].name.substring(0,3);
                // let value = track.artists[0].name + " " + track.name;

                let label = track.artists[0].name + " - " + track.name;
                label = label.replaceAll("å", "a");
                label = label.replaceAll("_", "");
                label = label.replaceAll(".", "");
                label = label.replaceAll("?", "");
                label = label.replaceAll("!", "");
                mapTracks.set(id, label);
              }
            });
        }

        mapTracks.forEach((value) => {
          tracks.push({ label: value, value: value.replaceAll(" -", "") })
        })

        let sortedTracks = [...tracks].sort((a, b) => a.label.localeCompare(b.label));

        [...sortedTracks].forEach(value => {
          // restituisce un solo valore nella lista
          if (value.value.toLowerCase() === inputValue.toLowerCase()) {
            var index = sortedTracks.indexOf(value);
            sortedTracks.forEach(value => {
              if (sortedTracks[index] != value)
                delete sortedTracks[sortedTracks.indexOf(value)]
            })

          }
          // restituisce nella lista i valori che includono inputValue
          if (value.value.toLowerCase().includes(inputValue.toLowerCase())) {
            sortedTracks.forEach(value => {
              if (!value.value.toLowerCase().includes(inputValue.toLowerCase())) {
                delete sortedTracks[sortedTracks.indexOf(value)]
              }
            })

          }

          return sortedTracks
        })

        callback(sortedTracks)
        return;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}