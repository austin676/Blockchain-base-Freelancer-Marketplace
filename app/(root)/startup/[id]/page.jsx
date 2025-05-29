"use client"
import { React, useState, useEffect, use } from 'react'
import { ethers } from 'ethers'
import { STARTUP_QUERY_BY_ID } from '@/sanity/lib/query'
import { client } from '@/sanity/lib/client'
import { formatDate } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import View from '@/components/view'
import { Button } from '@/components/ui/button'
import { FreelancerABI } from '@/contracts/FreelancerABI'

const CONTRACT_ADDRESS = "0xe4a192131B3C844C84042A4cE91c6a6cBDefb8a6"

export default function Page({ params }) {
  const { id } = use(params)
  const [post, setPost] = useState(null)
  const [account, setAccount] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [packages, setPackages] = useState({})
  const [selectedPackageId, setSelectedPackageId] = useState(1)
  const [txStatus, setTxStatus] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [postData, packagesData] = await Promise.all([
          client.fetch(STARTUP_QUERY_BY_ID, { id }),
          fetchPackages()
        ])
        
        if (!postData) return
        setPost(postData)
        setPackages(packagesData)
        await checkWalletConnection()
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [id])

  const fetchPackages = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FreelancerABI, provider)
      
      const packagesData = {}
      for (let i = 1; i <= 3; i++) {
        const pkg = await contract.packages(i)
        packagesData[i] = {
          id: i,
          title: pkg.title,
          cost: ethers.formatEther(pkg.cost),
          freelancer: pkg.freelancer,
          category: pkg.category,
          image: pkg.image
        }
      }
      return packagesData
    } catch (error) {
      console.error('Error loading packages:', error)
      return {}
    }
  }

  const checkWalletConnection = async () => {
    if (!window.ethereum) return
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        setAccount(accounts[0])
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(CONTRACT_ADDRESS, FreelancerABI, provider)
        const owner = await contract.owner()
        setIsOwner(accounts[0].toLowerCase() === owner.toLowerCase())
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask!')
      return
    }
    
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      await checkWalletConnection()
    } catch (error) {
      alert(`Connection failed: ${error.message}`)
    }
  }

  const hirePackage = async () => {
    if (!account) {
      alert("Please connect wallet first")
      return
    }

    setTxStatus('processing')
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FreelancerABI, signer)
      
      const costWei = ethers.parseEther(packages[selectedPackageId].cost)
      const balance = await provider.getBalance(account)
      
      if (balance < costWei) {
        throw new Error("Insufficient balance")
      }

      const tx = await contract.hire(selectedPackageId, {
        value: costWei
      })
      
      await tx.wait()
      setTxStatus('success')
      alert("Package hired successfully!")
    } catch (error) {
      setTxStatus('error')
      console.error("Hiring error:", error)
      alert(`Hiring failed: ${error.message}`)
    }
  }

  const approvePayment = async () => {
    if (!isOwner) {
      alert('Only contract owner can approve payments')
      return
    }
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FreelancerABI, signer)
      
      const tx = await contract.approvePayment(selectedPackageId)
      await tx.wait()
      alert('Payment approved successfully!')
    } catch (error) {
      console.error('Approval error:', error)
      alert(`Approval failed: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="pink_container !min-h-[230px]">
        <Skeleton className="w-full h-[200px]" />
      </div>
    )
  }

  if (!post) {
    return <div className="pink_container !min-h-[230px]">Startup not found</div>
  }

  return (
    <>
      <section className='pink_container !min-h-[230px]'>
        <p className='tag'>{formatDate(post._createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
        <p className='sub-heading !max-w-5xl'>{post.description}</p>
      </section>

      <section className='section_container'>
        <img 
          src={post.image} 
          alt="Startup thumbnail" 
          className="w-full h-auto rounded-xl"
        />

        <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
          <div className='flex-between gap-5'>
            <div>
              <p className='text-20-medium'>{post.author?.name}</p>
              <p className='text-20-medium !text-black-300'>@{post.author?.username}</p>
            </div>
            <p className='category-tag'>{post.category}</p>
          </div>

          {/* Project Details Section */}
          <h3 className='text-30-bold'>Project Details</h3>
          <div className="max-w-4xl font-work-sans text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">
            {post?.pitch}
          </div>
          <hr className='divider'/>

          {/* Contact Details */}
          <div>
            <h1 className="text-30-semibold">Contact Details</h1>
            <div className="flex mt-3">
              <p className="text-20-medium mr-2">Email:</p>
              <p className="text-20-medium !text-black-300 hover:!text-blue-500 hover:underline">
                {post.emailId}
              </p>
            </div>
            <div className="flex">
              <p className="text-20-medium mr-2">Phone:</p>
              <p className="text-20-medium">{post.PhoneNum}</p>
            </div>
          </div>

          {/* Packages Section */}
          <div className="mt-8 p-6 border rounded-lg bg-gray-50">
            <h3 className="text-24-bold mb-4">Available Packages</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {Object.values(packages).map((pkg) => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedPackageId === pkg.id 
                      ? "border-blue-500 bg-blue-50" 
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <h4 className="text-18-semibold">{pkg.title}</h4>
                  <p className="text-16-bold text-blue-600 mt-1">
                    {pkg.cost} ETH
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {!account ? (
                <Button 
                  onClick={connectWallet}
                  disabled={txStatus === 'processing'}
                  className="bg-primary border-[3px] border-black rounded-xl p-3 px-5 min-h-[60px] font-semibold text-[18px]"
                >
                  {txStatus === 'processing' ? 'PROCESSING...' : 'CONNECT WALLET'}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={hirePackage}
                    disabled={txStatus === 'processing'}
                    className="bg-primary border-[3px] border-black rounded-xl p-3 px-5 min-h-[60px] font-semibold text-[18px]"
                  >
                    {txStatus === 'processing' ? 'PROCESSING...' : 'HIRE PACKAGE'}
                  </Button>
                  
                  {isOwner && (
                    <Button 
                      onClick={approvePayment}
                      disabled={txStatus === 'processing'}
                      className="bg-purple-500 border-[3px] border-black rounded-xl p-3 px-5 min-h-[60px] font-semibold text-[18px]"
                    >
                      {txStatus === 'processing' ? 'PROCESSING...' : 'APPROVE PAYMENT'}
                    </Button>
                  )}
                </>
              )}
            </div>

            {account && (
              <div className="mt-4 p-4 bg-white rounded-lg border">
                <p className="text-16-medium">
                  Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </p>
                {isOwner && <p className="text-green-600 mt-1">(Contract Owner)</p>}
              </div>
            )}
          </div>
        </div>

        <View id={id} />
      </section>
    </>
  )
}