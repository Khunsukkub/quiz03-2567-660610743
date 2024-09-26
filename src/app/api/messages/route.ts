import { readDB, writeDB , originalDB , User } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();

  const roomId = await request.json();
  const foundRoom = originalDB.messages.find((DBroom) => DBroom.roomId === roomId);

  if(foundRoom){
    return NextResponse.json(
      {
        ok: true,
        message: foundRoom,
      });
  } 
  else {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const data = body;
  const foundRoom = originalDB.rooms.find((DBroom) => DBroom.roomId === data.roomId);

  if(!foundRoom){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }

  const roomId = data.roomId;
  const messageId = nanoid();
  const messageText = data.messageText;

  writeDB();

  originalDB.messages.push({
    roomId,
    messageId,
    messageText,
  });

  return NextResponse.json({
    ok: true,
    messageId : messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  const body = await request.json();
  const data = body;
  
  let role = null;
  role = (<User>payload).role;

  if(role !== "SUPER_ADMIN"){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  readDB();

  const foundMessage = originalDB.messages.find((DBmessages) => DBmessages.messageId === data.messageId);
  const foundIndex = originalDB.messages.findIndex((DBIndex) => DBIndex.messageId === data.messageId);

  if(!foundMessage){
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  writeDB();

  originalDB.messages.splice(foundIndex, 1);

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
