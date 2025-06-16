import { NextResponse } from "next/server";
import { auth } from "~/libs/auth";

const settingsContent = [
  {
    title: "General Settings",
    path: "/settings",
    content: "Manage your avatar, display name, and account settings",
    sections: [
      {
        title: "Avatar",
        content: "This is your avatar. Click on the avatar to upload a custom one from your files."
      },
      {
        title: "Display Name",
        content: "Please enter your full name, or a display name you are comfortable with."
      },
      {
        title: "Delete Account",
        content: "Permanently remove your Personal Account and all of its contents from the platform."
      }
    ]
  },
  {
    title: "Authentication",
    path: "/settings/authentication",
    content: "Manage your authentication settings and security preferences",
    sections: []
  },
  {
    title: "Kitchens",
    path: "/settings/kitchens",
    content: "View and manage your kitchens",
    sections: [
      {
        title: "Kitchens",
        content: "View all kitchens you are a member of and manage your roles."
      }
    ]
  }
];

export async function GET(request: Request) {
  const session = await auth();
  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() || "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const results = settingsContent.flatMap(page => {
    const pageMatches = [];
    
    // Check page title and content
    if (page.title.toLowerCase().includes(query) || 
        page.content.toLowerCase().includes(query)) {
      pageMatches.push({
        type: "page",
        title: page.title,
        path: page.path,
        content: page.content
      });
    }

    // Check sections
    const sectionMatches = page.sections
      .filter(section => 
        section.title.toLowerCase().includes(query) || 
        section.content.toLowerCase().includes(query)
      )
      .map(section => ({
        type: "section",
        title: section.title,
        path: page.path,
        content: section.content,
        pageTitle: page.title
      }));

    return [...pageMatches, ...sectionMatches];
  });

  return NextResponse.json({ results });
} 