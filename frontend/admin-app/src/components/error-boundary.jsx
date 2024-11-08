import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertCircle, RefreshCcw, Home, Mail, ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isOpen: false
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    console.error('Error:', error)
    console.error('Error Info:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex items-center justify-center min-h-screen p-4 bg-sidebar'>
          <Card className='w-full max-w-2xl mx-auto duration-500 shadow-lg animate-in fade-in-50'>
            <CardHeader className='flex flex-col items-center pb-2 space-y-1 text-center'>
              <div className='flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-sidebar-accent ring-4 ring-sidebar-ring/20'>
                <AlertCircle className='w-10 h-10 text-destructive animate-pulse' />
              </div>
              <CardTitle className='text-3xl font-bold tracking-tight'>Sorry! An error occurred</CardTitle>
              <p className='text-muted-foreground'>We have recorded this error and will fix it as soon as possible</p>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <Button className='w-full gap-2' onClick={() => window.location.reload()}>
                  <RefreshCcw className='w-4 h-4' />
                  Reload Page
                </Button>
                <Button variant='outline' className='w-full gap-2' onClick={() => (window.location.href = '/')}>
                  <Home className='w-4 h-4' />
                  Back to Home
                </Button>
              </div>

              <Separator className='my-4' />

              <Collapsible
                open={this.state.isOpen}
                onOpenChange={(isOpen) => this.setState({ isOpen })}
                className='w-full'
              >
                <CollapsibleTrigger asChild>
                  <Button variant='ghost' className='justify-between w-full'>
                    Error Details
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        this.state.isOpen ? 'transform rotate-180' : ''
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className='mt-4'>
                  <ScrollArea className='h-[200px] w-full rounded-md border bg-muted/50 p-4'>
                    <div className='space-y-2'>
                      <h4 className='text-sm font-medium'>Error Message:</h4>
                      <p className='font-mono text-sm text-muted-foreground'>
                        {this.state.error && this.state.error.toString()}
                      </p>
                      <h4 className='mt-4 text-sm font-medium'>Stack Trace:</h4>
                      <p className='font-mono text-sm whitespace-pre-wrap text-muted-foreground'>
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                      </p>
                    </div>
                  </ScrollArea>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>

            <CardFooter className='flex justify-center pt-2'>
              <Button
                variant='ghost'
                className='gap-2'
                onClick={() => (window.location.href = 'mailto:support@icoder.com')}
              >
                <Mail className='w-4 h-4' />
                Contact Support
              </Button>
            </CardFooter>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
