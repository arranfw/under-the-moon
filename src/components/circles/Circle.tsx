import React from "react";

import { cn, nameToFallbackText } from "@/util";

import { Avatar, AvatarProps } from "../Avatar";
import { Divider } from "../Divider";
import { SubmitButton } from "../SubmitButton";
import { Tooltip } from "../ToolTip";
import pluralize from "pluralize";

interface CircleAvatarProps extends React.PropsWithChildren {
  imageUrl: AvatarProps["imageUrl"];
  name: string | null;
}

const CircleAvatar: React.FC<CircleAvatarProps> = ({ imageUrl, name }) => {
  return (
    <div className="-mr-5 last-of-type:mr-0">
      <Tooltip tooltipContent={name}>
        <Avatar
          size={32}
          imageUrl={imageUrl}
          fallbackText={nameToFallbackText(name)}
        />
      </Tooltip>
    </div>
  );
};

interface CircleContainerProps extends React.PropsWithChildren {}

const CircleContainer: React.FC<CircleContainerProps> = ({ children }) => {
  return (
    <div
      className={cn(
        "flex justify-between",
        "border border-border rounded-md p-4",
      )}
    >
      {children}
    </div>
  );
};

interface CircleProps {
  circle: {
    id: string | null;
    name: string | null;
    description: string | null;
    userCount: number;
    users: {
      id: string | null;
      image: string | null;
      name: string | null;
    }[];
  };
  currentCircles: {
    id: string | null;
  }[];
  leaveCircle: (formData: FormData) => void;
  joinCircle: (formData: FormData) => void;
  createdBy?: {
    name: string | null;
    imageUrl: string | null;
  };
}

export const Circle: React.FC<CircleProps> = ({
  circle,
  currentCircles,
  leaveCircle,
  joinCircle,
  createdBy,
}) => {
  return (
    <CircleContainer key={circle.id}>
      <div>
        <h3>
          {circle.name}
          {circle.description && <small>: {circle.description}</small>}
        </h3>

        <Divider className="my-2" />

        <div className="flex items-center gap-2">
          {circle.users.map((user) => (
            <CircleAvatar
              key={user.id}
              imageUrl={user.image}
              name={user.name}
            />
          ))}
          {circle.users.length === 0 && <p className="w-max">No members yet</p>}
          <p className="w-max">
            {circle.userCount > 4
              ? `+${circle.userCount - 4} ${pluralize("other", circle.userCount - 4)}`
              : null}
          </p>
        </div>

        {createdBy?.name && (
          <div className="flex gap-2 mt-4">
            <p>Created by: </p>
            <Tooltip tooltipContent={createdBy.name}>
              <Avatar
                size={24}
                imageUrl={createdBy.imageUrl}
                fallbackText={nameToFallbackText(createdBy.name)}
              />
            </Tooltip>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        {currentCircles.some((userCircle) => userCircle.id === circle.id) ? (
          <form action={leaveCircle}>
            <input type="hidden" name="circleId" value={circle.id as string} />
            <SubmitButton tone="critical">Leave</SubmitButton>
          </form>
        ) : (
          <form action={joinCircle}>
            <input type="hidden" name="circleId" value={circle.id as string} />
            <SubmitButton tone="formAccent">Join</SubmitButton>
          </form>
        )}
      </div>
    </CircleContainer>
  );
};
