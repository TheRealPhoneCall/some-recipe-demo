import { Footer, Tabs } from 'flowbite-react'
import { IoFastFood, IoHeart, IoPerson } from 'react-icons/io5'

const AppFooter = () => {
  return (
    <Footer>
      <div className="flex w-full justify-between sm:items-center">
        <Tabs.Group
          aria-label="Tabs with underline"
          style="underline"
        >
          <Tabs.Item
            active={true}
            icon={IoFastFood}
            title="Recipes"
          >
          </Tabs.Item>
          <Tabs.Item
            icon={IoHeart}
            title="Favorites"
          >
          </Tabs.Item>
          <Tabs.Item
            icon={IoPerson}
            title="Favorites"
          >
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </Footer>
  )
}

export default AppFooter