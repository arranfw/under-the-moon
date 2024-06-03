"use client";

import React from "react";

import { cn, nameToFallbackText } from "@/util";

import { Avatar, AvatarProps } from "../Avatar";
import { Divider } from "../Divider";
import { SubmitButton } from "../SubmitButton";
import { Tooltip } from "../ToolTip";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pluralize from "pluralize";
import { useFormState } from "react-dom";

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
        "border border-border rounded-md p-4 min-h-40",
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
    hasPassword: boolean | null;
    users: {
      id: string | null;
      image: string | null;
      name: string | null;
    }[];
  };
  currentCircles: {
    circleId: string | null;
  }[];
  leaveCircle: (formData: FormData) => void;
  joinCircle: (
    prevState: any,
    formData: FormData,
  ) => Promise<{ message?: string } | undefined>;
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
  const isJoined = currentCircles.some((c) => c.circleId === circle.id);
  const [joinFormState, joinFormAction] = useFormState(joinCircle, {
    message: "",
  });

  return (
    <CircleContainer key={circle.id}>
      <div className="flex flex-col">
        <div>
          <h3>{circle.name}</h3>
          {circle.description && (
            <p className="text-sm">{circle.description}</p>
          )}
        </div>

        <Divider className="my-2" />

        <div className="flex items-center gap-2 grow">
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
        {isJoined ? (
          <div className="grid grid-rows-3 h-full items-end justify-items-center">
            <form action={leaveCircle} className="row-span-2">
              <input
                type="hidden"
                name="circleId"
                value={circle.id as string}
              />
              <SubmitButton tone="critical">Leave</SubmitButton>
            </form>
            <p className="text-sm">
              Joined{" "}
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
              />
            </p>
          </div>
        ) : (
          <form action={joinFormAction} className="flex gap-2 items-center">
            {circle.hasPassword && (
              <div className="flex flex-col">
                <input
                  type="password"
                  name="password"
                  className={cn(
                    "bg-transparent rounded border border-border",
                    "px-2 w-40",
                  )}
                  required
                  defaultValue=""
                  placeholder="Password"
                />
                {joinFormState?.message && (
                  <p className="text-xs text-red-500">
                    {joinFormState.message}
                  </p>
                )}
              </div>
            )}
            <input type="hidden" name="circleId" value={circle.id as string} />
            <SubmitButton tone="formAccent">Join</SubmitButton>
          </form>
        )}
      </div>
    </CircleContainer>
  );
};
