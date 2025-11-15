'use client'

import { useEffect, useState } from 'react'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Badge } from '../../ui/badge'
import { Card, CardContent } from '../../ui/card'
import {
  Search,
  Calendar,
  ArrowLeft,
  Eye,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  X
} from 'lucide-react'
import { getAllBlogsAPI, likeBlogAPI, viewBlogAPI } from '@/api'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Header from '../layout/Header'
import Footer from '../layout/Footer'
import Image from 'next/image'

export function BlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // Track liked blogs by blog ID - Initialize from localStorage immediately
  const [likedBlogs, setLikedBlogs] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const savedLikedBlogs = localStorage.getItem('likedBlogs')
      if (savedLikedBlogs) {
        try {
          const parsed = JSON.parse(savedLikedBlogs)
          return new Set(parsed)
        } catch (error) {
          console.error('Error parsing liked blogs from localStorage:', error)
        }
      }
    }
    return new Set()
  })
  const [isLiking, setIsLiking] = useState(false)

  const categories = [
    'All',
    'general',
    'nutrition',
    'workout',
    'lifestyle',
    'other'
  ]

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true)
        const response = await getAllBlogsAPI()
        setBlogs(response.data)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        toast.error('Failed to fetch blogs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  // Save liked blogs to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('likedBlogs', JSON.stringify(Array.from(likedBlogs)))
    }
  }, [likedBlogs])

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.description &&
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory =
      selectedCategory === 'All' || blog.type === selectedCategory
    return matchesSearch && matchesCategory
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All')
  }

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'All'

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'nutrition':
        return 'bg-green-500 text-white'
      case 'workout':
        return 'bg-blue-500 text-white'
      case 'lifestyle':
        return 'bg-purple-500 text-white'
      case 'general':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-orange-500 text-white'
    }
  }

  const openBlogDetail = async (blog: Blog) => {
    try {
      await viewBlogAPI(blog._id!)
      // Update views in the blogs array
      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b._id === blog._id ? { ...b, views: b.views + 1 } : b
        )
      )
      // Set selected blog with updated views
      setSelectedBlog({ ...blog, views: blog.views + 1 })
    } catch (error) {
      console.error('Error viewing blog:', error)
      toast.error('Failed to view the blog')
      setSelectedBlog(blog)
    }
  }

  const handleLike = async () => {
    if (!selectedBlog || isLiking) return

    // Check if user already liked this blog
    if (likedBlogs.has(selectedBlog._id!)) {
      toast.info('You have already liked this blog')
      return
    }

    setIsLiking(true)

    try {
      await likeBlogAPI(selectedBlog._id!)

      // Update the selected blog's likes count
      setSelectedBlog((prev) =>
        prev ? { ...prev, likes: prev.likes + 1 } : prev
      )

      // Update the blogs list
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === selectedBlog._id
            ? { ...blog, likes: blog.likes + 1 }
            : blog
        )
      )

      // Add to liked blogs
      setLikedBlogs((prev) => new Set([...prev, selectedBlog._id!]))

      toast.success('Thank you for liking this blog!')
    } catch (error) {
      console.error('Error liking blog:', error)
      toast.error('Failed to like the blog')
    } finally {
      setIsLiking(false)
    }
  }

  // Check if current blog is liked
  const isCurrentBlogLiked = selectedBlog
    ? likedBlogs.has(selectedBlog._id!)
    : false

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white">
        <Header />

        <article className="container mx-auto px-4 py-8 max-w-4xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => setSelectedBlog(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>

          {selectedBlog.thumbnailUrl && (
            <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-8 shadow-2xl">
              <Image
                src={selectedBlog.thumbnailUrl}
                alt={selectedBlog.name}
                width={800}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Badge
              className={`${getCategoryColor(selectedBlog.type)} rounded-lg`}
            >
              {selectedBlog.type}
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(selectedBlog.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{selectedBlog.views} views</span>
            </div>
            <Button
              onClick={handleLike}
              disabled={isCurrentBlogLiked || isLiking}
              className={`flex items-center gap-2 text-sm transition-all ${
                isCurrentBlogLiked
                  ? 'bg-pink-500 text-white cursor-not-allowed opacity-75'
                  : 'bg-pink-300 hover:bg-pink-400/80 text-gray-700'
              }`}
            >
              <Heart
                className={`w-4 h-4 ${isCurrentBlogLiked ? 'fill-white' : ''}`}
              />
              <span>
                {isLiking ? 'Liking...' : isCurrentBlogLiked ? 'Liked' : 'Like'}{' '}
                ({selectedBlog.likes})
              </span>
            </Button>
          </div>

          <h1 className="text-4xl lg:text-5xl mb-4">{selectedBlog.name}</h1>
          {selectedBlog.description && (
            <p className="text-xl text-muted-foreground mb-8">
              {selectedBlog.description}
            </p>
          )}

          {selectedBlog.content && (
            <div
              className="prose prose-lg max-w-none mb-12
                         prose-headings:font-bold 
                         prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                         prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                         prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                         prose-p:text-[#111827] prose-p:leading-relaxed prose-p:mb-4
                         prose-ul:my-6 prose-li:my-2
                         prose-ol:my-6
                         prose-blockquote:border-l-4 prose-blockquote:border-primary 
                         prose-blockquote:pl-6 prose-blockquote:italic 
                         prose-blockquote:bg-emerald-50 prose-blockquote:py-4 
                         prose-blockquote:rounded-r-xl
                         prose-strong:text-primary prose-strong:font-semibold"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
          )}

          <Card className="rounded-2xl border-[#e5e7eb] bg-gradient-to-r from-emerald-50 to-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Share2 className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Share this article</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Facebook className="w-4 h-4 mr-2" />
                    Facebook
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Twitter className="w-4 h-4 mr-2" />
                    Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </article>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white">
      <Header />

      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl lg:text-5xl">FitTrack Blog</h1>
          <p className="text-xl text-muted-foreground">
            Expert fitness advice, workout tips, nutrition guides, and
            motivation to help you reach your goals
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search articles by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 rounded-2xl border-[#e5e7eb] bg-white h-14 text-lg"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Filter by:
            </span>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-xl whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary hover:bg-primary/90'
                    : ''
                }`}
              >
                {category === 'All'
                  ? 'All'
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading blogs...</p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Card
                key={blog._id}
                className="rounded-2xl border-[#e5e7eb] shadow-sm hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
                onClick={() => openBlogDetail(blog)}
              >
                {blog.thumbnailUrl && (
                  <div className="relative aspect-[16/9] bg-[#f9fafb]">
                    <Image
                      src={blog.thumbnailUrl}
                      alt={blog.name}
                      width={400}
                      height={250}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge
                      className={`absolute top-3 left-3 ${getCategoryColor(
                        blog.type
                      )} rounded-lg`}
                    >
                      {blog.type}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{blog.views}</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Heart
                        className={`w-3 h-3 ${
                          likedBlogs.has(blog._id!)
                            ? 'fill-pink-500 text-pink-500'
                            : ''
                        }`}
                      />
                      <span>{blog.likes}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {blog.name}
                    </h3>
                    {blog.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {blog.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <div className="w-24 h-24 mx-auto bg-[#e5e7eb] rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                variant="outline"
                className="rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
