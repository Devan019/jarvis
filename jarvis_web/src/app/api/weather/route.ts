import { NextRequest, NextResponse } from "next/server";

const OPEN_WEATHER_KEY = process.env.OPEN_WEATHER_KEY;

export async function GET(req: NextRequest) {
  try {
    // get city from query params
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    // call OpenWeather API
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPEN_WEATHER_KEY}&units=metric`
    );

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}