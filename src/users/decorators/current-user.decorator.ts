import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import { CURRENT_USER_KEY } from "src/utils/constants";
import { JWTPayloadType } from "src/utils/types";

// /current-user.decorator.ts
export const currentUser = createParamDecorator(
    (data,context:ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        const payload:JWTPayloadType = request[CURRENT_USER_KEY];
        return payload;
    }
);