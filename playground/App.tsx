import { useState } from "react"
import {
  Accordion, AspectRatio, Avatar, Badge, Box, Button, ButtonGroup, Card, CardContent, ColorModeButton,
  CardDescription, CardFooter, CardHeader, CardTitle, Carousel, Checkbox, CodeBlock,
  ColorSwatch, DataList, Flex, Grid, Item, Progress, Provider, RadioGroup, Select,
  Skeleton, Stack, Stat, Status, Switch, Text, Toggle, defaultSystem, useColorMode,
} from "@indoku/ui"

const componentNames = ["Button Group", "Badge", "Card", "Avatar", "Aspect Ratio", "Item", "Skeleton", "Progress", "Status", "Stat", "Data List", "Accordion", "Carousel", "Color Swatch", "Code Block"]

function ColorModeControls() {
  const { colorMode, preference, setColorMode } = useColorMode()
  return <Flex alignItems="center" justifyContent="space-between" gap="3" wrap="wrap">
    <Stack gap="1"><Text fontSize="xs" fontWeight="semibold" color="fg.muted">COLOR MODE</Text><Text fontWeight="semibold">{colorMode ?? "resolving…"}<Text as="span" color="fg.muted" fontSize="sm"> · {preference}</Text></Text></Stack>
    <Flex gap="2" alignItems="center"><ColorModeButton label="Toggle color mode" /><Box w="150px"><Select aria-label="Color mode preference" value={preference} onValueChange={(v) => setColorMode(v as "system" | "light" | "dark")} items={[{label:"System",value:"system"},{label:"Light",value:"light"},{label:"Dark",value:"dark"}]} /></Box></Flex>
  </Flex>
}

function Preview({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <Box id={title.toLowerCase().replaceAll(" ", "-")} border="1px solid" borderColor="border.subtle" borderRadius="lg" overflow="hidden" bg="bg.surface">
    <Box p="4" borderBottom="1px solid" borderColor="border.subtle"><Text fontWeight="semibold">{title}</Text><Text color="fg.muted" fontSize="sm" mt="1">{description}</Text></Box>
    <Box p={{ base: "4", md: "6" }} minH="110px"><Flex minH="70px" alignItems="center" gap="3" wrap="wrap">{children}</Flex></Box>
  </Box>
}

function Gallery() {
  const [progress, setProgress] = useState(42)
  const [radio, setRadio] = useState("comfortable")
  const [carouselIndex, setCarouselIndex] = useState(0)
  return <Box as="main" minH="100vh" bg="bg.canvas" color="fg.default" fontFamily="system-ui, sans-serif">
    <Box position="sticky" top="0" zIndex="10" bg="bg.canvas" borderBottom="1px solid" borderColor="border.subtle">
      <Flex maxW="1280px" mx="auto" px={{base:"4",md:"8"}} h="64px" alignItems="center" justifyContent="space-between" gap="3">
        <Flex alignItems="center" gap="3"><Box display="grid" placeItems="center" w="32px" h="32px" borderRadius="md" bg="primary.default" color="primary.foreground" fontWeight="bold">i</Box><Text fontWeight="bold" fontSize="lg">IndokuUI <Text as="span" color="fg.muted" fontWeight="medium">/ components</Text></Text></Flex>
        <Text fontSize="xs" color="fg.muted" border="1px solid" borderColor="border.subtle" borderRadius="full" px="3" py="2">LIVE PLAYGROUND</Text>
      </Flex>
    </Box>
    <Grid maxW="1280px" mx="auto" columns={{base:1,lg:"240px minmax(0, 1fr)"}} gap="8" p={{base:"4",md:"8"}}>
      <Box display={{base:"none",lg:"block"}}>
        <Box position="sticky" top="88px">
          <Text fontSize="xs" fontWeight="semibold" color="fg.muted" mb="3">COMPONENTS</Text>
          <Stack gap="1">{componentNames.map((name) => <Box key={name} as="a" href={`#${name.toLowerCase().replaceAll(" ", "-")}`} px="3" py="2" borderRadius="md" color="fg.muted" fontSize="sm" _hover={{bg:"bg.subtle",color:"fg.default"}}>{name}</Box>)}</Stack>
        </Box>
      </Box>
      <Stack gap="8" minW="0">
        <Stack gap="3" py="3">
          <Text fontSize="xs" fontWeight="semibold" color="brand.500">INDOKU UI · COMPONENT LAB</Text>
          <Text as="h1" fontSize={{base:"2xl",md:"3xl"}} fontWeight="bold" lineHeight="1.15">Components, live and in context.</Text>
          <Text color="fg.muted" maxW="680px" lineHeight="1.7">Preview the components implemented so far. Try the controls, switch color modes, and check their current visual states directly in the playground.</Text>
          <Box border="1px solid" borderColor="border.subtle" borderRadius="lg" bg="bg.surface" p="4"><ColorModeControls /></Box>
        </Stack>

        <Stack gap="3"><Flex alignItems="end" justifyContent="space-between"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">01 / ACTIONS</Text><Text as="h2" fontSize="xl" fontWeight="bold">Button Group</Text></Stack><Text color="fg.muted" fontSize="xs">Interactive</Text></Flex>
          <Preview title="Button Group" description="Attached and separated action groups."><ButtonGroup><Button variant="outline">Back</Button><Button variant="outline">Cancel</Button><Button>Save changes</Button></ButtonGroup><ButtonGroup attached><Button variant="outline">−</Button><Button variant="outline">1</Button><Button variant="outline">+</Button></ButtonGroup></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end" justifyContent="space-between"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">02 / LABELS</Text><Text as="h2" fontSize="xl" fontWeight="bold">Badge</Text></Stack></Flex>
          <Preview title="Badge" description="Variants for labels and statuses."><Badge>New</Badge><Badge variant="secondary">Secondary</Badge><Badge variant="outline">Draft</Badge><Badge variant="success">Success</Badge><Badge variant="warning">Warning</Badge><Badge variant="destructive">Destructive</Badge></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">03 / SURFACES</Text><Text as="h2" fontSize="xl" fontWeight="bold">Card</Text></Stack></Flex>
          <Preview title="Card" description="Header, content, description, and footer composition."><Card maxW="360px" w="100%"><CardHeader><CardTitle>Team workspace</CardTitle><CardDescription>A shared place for your project.</CardDescription></CardHeader><CardContent><Text fontSize="sm" color="fg.muted">3 members · Updated just now</Text></CardContent><CardFooter><Button size="sm">Open workspace</Button><Button size="sm" variant="outline">Settings</Button></CardFooter></Card></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">04 / IDENTITY</Text><Text as="h2" fontSize="xl" fontWeight="bold">Avatar</Text></Stack></Flex>
          <Preview title="Avatar" description="Image, initials fallback, and size variants."><Avatar name="Ada Lovelace" size="sm"/><Avatar name="Grace Hopper"/><Avatar name="Alan Turing" size="lg"/><Avatar name="Katherine Johnson" size="xl"/><Avatar name="Image fallback" src="/missing-avatar.png"/></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">05 / LAYOUT</Text><Text as="h2" fontSize="xl" fontWeight="bold">Aspect Ratio</Text></Stack></Flex>
          <Preview title="Aspect Ratio" description="Stable ratio for responsive media slots."><Grid columns={{base:1,sm:2}} gap="4" w="100%"><AspectRatio ratio={16/9}><Box bg="bg.subtle" borderRadius="md" display="grid" placeItems="center" w="100%" h="100%"><Text color="fg.muted">16:9 preview</Text></Box></AspectRatio><AspectRatio ratio={1}><Box bg="bg.subtle" borderRadius="md" display="grid" placeItems="center" w="100%" h="100%"><Text color="fg.muted">1:1 preview</Text></Box></AspectRatio></Grid></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">06 / LIST ITEMS</Text><Text as="h2" fontSize="xl" fontWeight="bold">Item</Text></Stack></Flex>
          <Preview title="Item" description="Leading content, descriptive text, and trailing action."><Stack gap="3" w="100%"><Item variant="outline" title="Design system update" description="Tokens and components are ready for review." startElement={<Avatar name="Indoku UI"/>} endElement={<Badge variant="secondary">Review</Badge>}/><Item title="Build completed" description="All playground checks passed." startElement={<Status color="success"> </Status>} endElement={<Text fontSize="xs" color="fg.muted">2m ago</Text>}/></Stack></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">07 / LOADING</Text><Text as="h2" fontSize="xl" fontWeight="bold">Skeleton</Text></Stack></Flex>
          <Preview title="Skeleton" description="Loading placeholders for common content shapes."><Stack gap="3" w="100%"><Flex gap="3" alignItems="center"><Skeleton circle w="44px" h="44px"/><Stack gap="2" flex="1"><Skeleton h="12px" w="45%"/><Skeleton h="10px" w="75%"/></Stack></Flex><Skeleton h="100px" w="100%"/><Button size="sm" variant="outline" onClick={(e:any)=>{const el=e.currentTarget.parentElement?.querySelector('[data-skeleton-demo]'); if(el) el.toggleAttribute('hidden')}}>Toggle loading preview</Button><Box data-skeleton-demo><Text fontSize="sm" color="fg.muted">Loaded content appears here after the loading state.</Text></Box></Stack></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">08 / FEEDBACK</Text><Text as="h2" fontSize="xl" fontWeight="bold">Progress</Text></Stack></Flex>
          <Preview title="Progress" description="Determinate progress with editable value."><Stack gap="3" w="100%"><Flex alignItems="center" justifyContent="space-between"><Text fontSize="sm">Upload progress</Text><Text fontSize="sm" color="fg.muted">{progress}%</Text></Flex><Progress value={progress} label="Upload progress"/><Flex gap="2"><Button size="sm" variant="outline" onClick={()=>setProgress(v=>Math.max(0,v-10))}>−10%</Button><Button size="sm" variant="outline" onClick={()=>setProgress(v=>Math.min(100,v+10))}>+10%</Button><Button size="sm" variant="outline" onClick={()=>setProgress(100)}>Complete</Button></Flex></Stack></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">09 / STATUS</Text><Text as="h2" fontSize="xl" fontWeight="bold">Status</Text></Stack></Flex>
          <Preview title="Status" description="Compact indicators for common states."><Stack gap="3"><Status color="success">Operational</Status><Status color="info">Syncing</Status><Status color="warning">Needs attention</Status><Status color="danger">Service issue</Status><Status color="neutral">Offline</Status></Stack></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">10 / METRICS</Text><Text as="h2" fontSize="xl" fontWeight="bold">Stat</Text></Stack></Flex>
          <Preview title="Stat" description="Metric, trend, and supporting text."><Grid columns={{base:1,sm:3}} gap="4" w="100%"><Box p="4" border="1px solid" borderColor="border.subtle" borderRadius="md"><Stat label="Total users" value="12,480" change="↑ 12.8%" trend="up" helpText="Compared to last month"/></Box><Box p="4" border="1px solid" borderColor="border.subtle" borderRadius="md"><Stat label="Conversion" value="4.32%" change="↓ 0.4%" trend="down" helpText="Compared to last month"/></Box><Box p="4" border="1px solid" borderColor="border.subtle" borderRadius="md"><Stat label="Active projects" value="28" helpText="Across all teams"/></Box></Grid></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">11 / KEY-VALUE</Text><Text as="h2" fontSize="xl" fontWeight="bold">Data List</Text></Stack></Flex>
          <Preview title="Data List" description="Readable detail rows for metadata and settings."><Box w="100%" maxW="520px"><DataList items={[{label:"Name",value:"Indoku UI"},{label:"Version",value:"0.0.1"},{label:"Status",value:<Badge variant="success">Active</Badge>},{label:"Maintainer",value:"UI Platform Team"}]} /></Box></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">12 / DISCLOSURE</Text><Text as="h2" fontSize="xl" fontWeight="bold">Accordion</Text></Stack></Flex>
          <Preview title="Accordion" description="Expandable sections; open and close each question."><Box w="100%"><Accordion items={[{value:"tokens",title:"How do design tokens work?",content:"Tokens provide consistent values for color, spacing, typography, and other visual properties."},{value:"themes",title:"Does it support dark mode?",content:"Yes. Use the Provider and semantic tokens to switch between light and dark themes."},{value:"accessibility",title:"Are keyboard interactions supported?",content:"The accordion is built on Ark UI primitives. Keyboard behavior should still be verified as part of component QA."}]} /></Box></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">13 / NAVIGATION</Text><Text as="h2" fontSize="xl" fontWeight="bold">Carousel</Text></Stack></Flex>
          <Preview title="Carousel" description="Slide navigation with previous/next and pagination."><Box w="100%"><Carousel items={[<Box key="one" p="8" bg="bg.subtle" borderRadius="md" textAlign="center"><Text fontSize="lg" fontWeight="semibold">Slide 1 · Foundations</Text><Text mt="2" color="fg.muted" fontSize="sm">Tokens, themes, and primitives</Text></Box>,<Box key="two" p="8" bg="bg.subtle" borderRadius="md" textAlign="center"><Text fontSize="lg" fontWeight="semibold">Slide 2 · Components</Text><Text mt="2" color="fg.muted" fontSize="sm">Composable and reusable building blocks</Text></Box>,<Box key="three" p="8" bg="bg.subtle" borderRadius="md" textAlign="center"><Text fontSize="lg" fontWeight="semibold">Slide 3 · Ship</Text><Text mt="2" color="fg.muted" fontSize="sm">Test behavior, accessibility, and themes</Text></Box>]} /></Box></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">14 / COLOR</Text><Text as="h2" fontSize="xl" fontWeight="bold">Color Swatch</Text></Stack></Flex>
          <Preview title="Color Swatch" description="Color values shown as labeled swatches."><Flex gap="4" alignItems="center" wrap="wrap">{[{label:"Primary",value:"#6750A4"},{label:"Success",value:"#27865B"},{label:"Warning",value:"#C58B21"},{label:"Danger",value:"#C74646"},{label:"Neutral",value:"#858585"}].map(c=><Stack key={c.label} alignItems="center" gap="2"><ColorSwatch value={c.value} size="lg"/><Text fontSize="xs" color="fg.muted">{c.label}</Text><Text fontSize="xs">{c.value}</Text></Stack>)}</Flex></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">15 / CODE</Text><Text as="h2" fontSize="xl" fontWeight="bold">Code Block</Text></Stack></Flex>
          <Preview title="Code Block" description="Scrollable code display. Syntax highlighting is not included yet."><Box w="100%"><CodeBlock language="tsx" showLineNumbers code={'import { Badge } from "@indoku/ui"\n\nexport function Example() {\n  return <Badge>Ready</Badge>\n}'} /></Box></Preview>
        </Stack>
        <Stack gap="3"><Flex alignItems="end"><Stack gap="1"><Text color="brand.500" fontSize="xs" fontWeight="semibold">BONUS / FORM CONTROLS</Text><Text as="h2" fontSize="xl" fontWeight="bold">Existing controls</Text></Stack></Flex>
          <Preview title="Controls" description="Existing inputs alongside the new display components."><Stack gap="4" w="100%"><Checkbox defaultChecked>Accept terms</Checkbox><Switch defaultChecked>Enable notifications</Switch><RadioGroup aria-label="Density" value={radio} onValueChange={setRadio} items={[{label:"Compact",value:"compact"},{label:"Comfortable",value:"comfortable"},{label:"Spacious",value:"spacious"}]} /><Flex gap="2"><Toggle>Bold</Toggle><Button variant="outline">Cancel</Button><Button>Save</Button></Flex></Stack></Preview>
        </Stack>
        <Flex justifyContent="space-between" gap="3" pt="5" borderTop="1px solid" borderColor="border.subtle" color="fg.muted" fontSize="xs"><Text>Indoku UI · Local playground</Text><Text>15 component previews</Text></Flex>
      </Stack>
    </Grid>
  </Box>
}

export default function App() {
  return <Provider value={defaultSystem} defaultColorMode="system"><Gallery /></Provider>
}
