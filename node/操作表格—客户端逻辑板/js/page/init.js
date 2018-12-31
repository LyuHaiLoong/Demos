class Init extends Table {
  constructor() {
    super();
  }
  async init() {
    await this.get("/init", "json", "list", this.i, ["id", "name", "age"]);
  }
  // function
  // get data
  async get(a, b, c, d, ...e) { // url,dataType,dataTarget,DOM,key
    await fetch(a)
      .then(j => j[b]())
      .then(j => {
        this.table(d, c ? j[c] : j, ...e);
      })
      .catch(err => {
        throw new Error(err);
      });
  }
}