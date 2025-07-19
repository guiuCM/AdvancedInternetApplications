# lab5
![first](https://github.com/Danieluss/AdvancedInternetApplications/blob/master/lab_5/lab_5_1.png "Shop view")
![second](https://github.com/Danieluss/AdvancedInternetApplications/blob/master/lab_5/lab_5_2.png "Cart view")

### Build & run
#### docker-compose
```
docker-compose build
docker-compose up
```
#### without docker-compose
You need mongodb `3.6+` running locally at `27017`.

```
npm install
npm start
```

### Populate mongo

```
node ./seed/seeder.js
```

### View

Navigate to `localhost:8000`.

