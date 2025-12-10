import userSlice, { loginUser, updateUserProfile } from "../user/userSlice"
import { it, expect, describe } from "vitest"

const user1 = {
    username: "testuser1",
    address: {
        street: "pass1"
    },
    company: {
        catchPhrase: "im a test!"
    }
}

describe("Test Profile", () => {
    // REDUCERS CAN'T FETCH, reducer requires external fetch.
    it('should fetch the user\'s profile username', () => {
        let currState = userSlice(undefined, loginUser({
            response: [user1],
            formInput: {
                password: "pass1"
            }
        }))
        expect(currState.username).toBeTruthy()
    });

    it('should update user\'s profile', () => {
        let currState = userSlice(undefined, loginUser({
            response: [user1],
            formInput: {
                password: "pass1"
            }
        }))

        currState = userSlice(undefined, updateUserProfile({
            displayName: "tu1",
            email: "tu1@email",
            phone: "111-111-1111",
            zip: "11111",
            password: "1"
        }))

        expect(currState.displayName).toEqual('tu1')
        expect(currState.userEmail).toEqual('tu1@email')
        expect(currState.phone).toEqual('111-111-1111')
        expect(currState.zip).toEqual('11111')
    });
})
