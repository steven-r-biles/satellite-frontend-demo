export class DataProvider {
  getData(name: string) {
    return fetch(`./${name}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Response error: ${response.status}`);
        }
        return response.json();
      })
  }
}