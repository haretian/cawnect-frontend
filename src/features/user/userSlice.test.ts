import userSlice, { loginUser, logoutUser, loginNewUser } from "./userSlice"
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

describe("Test Auth", () => {
    it('should log in a previously registered user', () => {
        let currState = userSlice(undefined, loginUser({
            response: [user1],
            formInput: {
                password: "pass1"
            }
        }))
        expect(currState.username).toBeTruthy()
    });

    it('should not log in an invalid user', () => {
        let currState = userSlice(undefined, loginUser({
            response: [],
            formInput: {
                password: "pass1"
            }
        }))
        expect(currState.loginError).toBeTruthy()
    });

    it('should not log in incorrect password', () => {
        let currState = userSlice(undefined, loginUser({
            response: [user1],
            formInput: {
                password: "pass2"
            }
        }))
        expect(currState.loginError).toBeTruthy()
    });

    it('should log out a user', () => {
        let currState = userSlice(undefined, loginUser({
            response: [user1],
            formInput: {
                password: "pass1"
            }
        }))
        currState = userSlice(currState, logoutUser())
        expect(currState.username).toBeFalsy()
    });

    it('should register a user', () => {
        let currState = userSlice(undefined, loginNewUser({
            userid: 1,
            username: "testuser2",
        }))
        expect(currState.username).toEqual('testuser2')
    });
})

