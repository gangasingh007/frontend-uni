import {atom} from "recoil"

export const statsAtom = atom({
    key : "statsAtom",
    default : {
        users : 0,
        resources : 0
    }
})
