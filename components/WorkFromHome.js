import { FaSlack, FaDiscord, FaTrello, FaGithub, FaJira, FaAmazon, FaExternalLinkAlt } from 'react-icons/fa';

export default function WorkFromHome() {
  const remoteWorkTips = [
    {
      title: "Set Up a Dedicated Workspace",
      description: "Create a quiet, comfortable, and well-lit workspace separate from your living area."
    },
    {
      title: "Maintain Regular Hours",
      description: "Keep a consistent schedule to maintain work-life balance and stay productive."
    },
    {
      title: "Take Regular Breaks",
      description: "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds."
    },
    {
      title: "Stay Connected",
      description: "Regularly communicate with colleagues using video calls and chat tools."
    },
    {
      title: "Practice Self-Care",
      description: "Exercise regularly, eat well, and maintain good sleep habits."
    }
  ];

  const essentialTools = [
    {
      name: "Slack",
      icon: <FaSlack />,
      description: "Team communication and collaboration platform",
      url: "https://slack.com"
    },
    {
      name: "Discord",
      icon: <FaDiscord />,
      description: "Voice, video, and text chat for teams",
      url: "https://discord.com"
    },
    {
      name: "Trello",
      icon: <FaTrello />,
      description: "Visual project management tool",
      url: "https://trello.com"
    },
    {
      name: "GitHub",
      icon: <FaGithub />,
      description: "Code hosting and collaboration platform",
      url: "https://github.com"
    },
    {
      name: "Jira",
      icon: <FaJira />,
      description: "Project and issue tracking software",
      url: "https://www.atlassian.com/software/jira"
    }
  ];

  const recommendedProducts = [
    {
      name: "QUTOOL Lumbar Support Pillow",
      description: "Office Chair Back Support Pillow for Car, Computer, Gaming Chair Memory Foam Back Cushion for Back Pain Relief Improve Posture, Mesh Cover Double Adjustable Straps",
      url: "https://amzn.to/4bHT6Jl"
    },
    {
      name: "LAPGEAR Home Office Lap Desk",
      description: "Device Ledge, Mouse Pad, and Phone Holder - Oak Woodgrain - Fits up to 15.6 Inch Laptops - Style No. 91589",
      url: "https://amzn.to/424j19N"
    },
    {
      name: "Memory Foam Foot Rest",
      description: "Foot Rest for Under Desk at Work - Memory Foam Office Foot Stool & Under Desk Footrest Leg Elevation Pillow for Gaming & Home Office, Supports Posture",
      url: "https://amzn.to/41G9ZiV"
    },
    {
      name: "LED Desk Lamp",
      description: "Eye-Caring Desk Light with Stepless Dimming Adjustable Flexible Gooseneck, 10W USB Adapter Desk Lamp with Clamp for Reading, Study, Workbench (Black)",
      url: "https://amzn.to/4bNN89W"
    },
    {
      name: "Lamicall Adjustable Laptop Stand",
      description: "Portable Laptop Riser, Aluminum Laptop Stand for Desk Foldable, Ergonomic Computer Notebook Stand Holder for MacBook Air Pro, Dell XPS, HP (10-17.3'') - Silver",
      url: "https://amzn.to/424jZTt"
    },
    {
      name: "VOBAGA Coffee Mug Warmer",
      description: "Coffee Mug Warmer for Desk with Auto Shut Off & 3-Temp Settings, Coffee Cup Warmer with Smart Safety Alert Home Office Accessory, Perfect for Coffee, Tea, Milk (No Mug)",
      url: "https://amzn.to/4kKrR4Y"
    }
  ];

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Work From Home</h2>

      {/* Remote Work Tips Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Remote Work Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {remoteWorkTips.map((tip, index) => (
            <div key={index} className="p-6 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-lg text-blue-800 mb-2">{tip.title}</h4>
              <p className="text-blue-600">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Tools Section */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Essential Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essentialTools.map((tool, index) => (
            <a
              key={index}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="text-2xl text-gray-600 mr-4">{tool.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-800">{tool.name}</h4>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Recommended Products Section */}
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Recommended Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendedProducts.map((product, index) => (
            <div key={index} className="p-6 border rounded-xl hover:shadow-md transition-shadow duration-200">
              <h4 className="font-semibold text-gray-800 mb-2">{product.name}</h4>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF9900] text-white rounded-lg hover:bg-[#FF9900]/90 transition-colors duration-200"
              >
                <FaAmazon />
                <span>Buy on Amazon</span>
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 