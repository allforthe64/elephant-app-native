import { deleteObject, ref } from "firebase/storage";
import { storage } from "./firebaseConfig";

//delete existing file in storage
export const deleteFile = (path) => {
    //delete the file 
    deleteObject(ref(storage, path))
}