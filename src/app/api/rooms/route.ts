import { readDB, writeDB , originalDB , User} from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();

  return NextResponse.json({
    ok: true,
    rooms: originalDB.rooms,
    totalRooms: originalDB.rooms.length,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();

  if(!payload){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  let role = null;
  role = (<User>payload).role;
  if(role !== "ADMIN"){
    if(role !== "SUPER_ADMIN"){
      return NextResponse.json(
        {
          ok: true,
          message: "Only Admin or Super Admin can access this API route",
        },
        { status: 403 }
      );
    }
  }

  readDB();

  const roomName = await request.json();
  const foundRoom = originalDB.rooms.find((DBroom) => DBroom.roomName.toUpperCase === roomName.toUpperCase);
  
  if(foundRoom){
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  //call writeDB after modifying Database
  writeDB();

  originalDB.rooms.push({
    roomId,
    roomName,
  });

  return NextResponse.json({
    ok: true,
    roomId: roomId,
    message: `Room ${roomName} has been created`,
  });
};
