import {DataSource,DataSourceOptions} from "typeorm";
import { Product } from "../src/products/product.entity";
import { User } from "../src/users/user.entity";
import { Review } from "../src/reviews/review.entity";

import { config } from "dotenv";
//dot env config
config({path:".env"});
//data source options
export const dataSourceOptions: DataSourceOptions = {
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities:[Product,User,Review],
    migrations:["dist/db/migrations/*.js"],

}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;