import Base from "./base";
import { Gender } from "@/types";

export default interface User extends Base {
  email: string;
  first_name: string;
  last_name: string;
  gender: Gender;
  age: number;
  isLiked?: boolean;
}